import { github, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();

    const githubEmailsResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const githubEmails: GitHubEmail[] = await githubEmailsResponse.json();

    const primaryEmail = githubEmails.find((email) => email.primary)?.email;

    if (!primaryEmail) {
      return new Response(null, {
        status: 500,
      });
    }

    let user = await prisma.user.findFirst({
      where: {
        email: primaryEmail,
      },
    });

    if (user) {
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sets",
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    user = await prisma.user.create({
      data: {
        id: userId,
        email: primaryEmail,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sets",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

type GitHubUser = {
  login: string;
  email: string;
  avatar_url: string;
};

interface GitHubEmail {
  email: string;
  verified: string;
  primary: boolean;
  visibility: string;
}
