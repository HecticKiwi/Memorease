## Memorease
**Simple but powerful flashcard app**

A full-stack web application, which replicates the basic features of Quizlet. It's fairly basic as it was only done to reinforce what I've learned. Users can:

- Sign in through OAuth (Google/GitHub)
- Create, edit, and delete flashcard sets
- Drag and drop to reorder flashcards
- Study by marking flashcards as "Know" or "Still learning"; only revisit "Still learning" cards
- Randomize the flashcard order

View the site [here](https://hk-memorease.vercel.app/).

### Tools used

I used Next JS as the overarching framework.

#### Frontend
-  Tailwind and ShadCN for styling
-  React Query for infinite scrolling
-  React Hook Form + Zod for forms & validation
-  Dnd Kit for the drag & drop functionality

#### Backend
-  Prisma for the postgres ORM
-  Lucia for authentication
