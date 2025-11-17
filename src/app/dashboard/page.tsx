import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { decksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default async function DashboardPage() {
	const { userId } = await auth();

	// Redirect to home if not authenticated
	if (!userId) {
		redirect('/');
	}

	// Fetch user's decks
	const decks = await db
		.select()
		.from(decksTable)
		.where(eq(decksTable.userId, userId));

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8 flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Decks</h1>
					<p className='text-muted-foreground'>Manage your flashcard decks</p>
				</div>
				<Button size='lg'>Create New Deck</Button>
			</div>

			{decks.length === 0 ? (
				<Card className='border-dashed'>
					<CardHeader className='text-center'>
						<CardTitle>No decks yet</CardTitle>
						<CardDescription>
							Get started by creating your first flashcard deck
						</CardDescription>
					</CardHeader>
					<CardContent className='flex justify-center'>
						<Button>Create Your First Deck</Button>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{decks.map(deck => (
						<Card
							key={deck.id}
							className='transition-all hover:border-gray-700 hover:shadow-lg'
						>
							<CardHeader>
								<CardTitle>{deck.name}</CardTitle>
								{deck.description && (
									<CardDescription>{deck.description}</CardDescription>
								)}
							</CardHeader>
							<CardFooter className='flex gap-2'>
								<Button variant='outline' size='sm' asChild>
									<Link href={`/deck/${deck.id}`}>View Cards</Link>
								</Button>
								<Button variant='ghost' size='sm'>
									Edit
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
