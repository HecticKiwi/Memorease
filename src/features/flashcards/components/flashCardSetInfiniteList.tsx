"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { getFlashcardSets, GetFlashcardSetsResponse } from "../server";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";

function FlashcardSetInfiniteList({
  sets,
}: {
  sets: GetFlashcardSetsResponse;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [ref, entry] = useIntersectionObserver();

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [
      "flashcards",
      {
        searchTerm: debouncedSearchTerm,
        orderBy: {
          createdAt: "desc",
        },
      },
    ],
    queryFn: async ({ pageParam }) => {
      const response = await getFlashcardSets({
        searchTerm: debouncedSearchTerm,
        orderBy: {
          createdAt: "desc",
        },
        cursor: pageParam,
      });

      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);

  return (
    <div className="">
      <div className="grid grid-cols-2">
        <div></div>
        <label className="relative flex items-center">
          <Input
            placeholder="Search your sets"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12"
          />
          <Search className="absolute inset-y-auto right-4 size-5 text-muted-foreground" />
        </label>
      </div>

      <div className="mt-6 space-y-6">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.sets.map((set) => (
              <div key={set.id} className="rounded-lg border p-4">
                <div className="flex">
                  <span>{set._count.cards} Terms</span>
                  <span className="ml-5 border-l pl-5">
                    {set.author.username}
                  </span>
                </div>
                <Link
                  href={`/sets/${set.id}`}
                  className="mt-4 block text-lg font-bold hover:text-muted-foreground"
                >
                  {set.title}
                </Link>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <Button
        ref={ref}
        disabled={isFetching || !hasNextPage}
        onClick={() => fetchNextPage()}
        className="mx-auto mt-8 block"
      >
        {isFetching
          ? "Loading more..."
          : hasNextPage
            ? "Load more"
            : "Nothing more to load"}
      </Button>
    </div>
  );
}

export default FlashcardSetInfiniteList;
