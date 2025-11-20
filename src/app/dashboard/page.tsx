import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserDecks } from '@/db/queries';
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
import { CreateDeckDialog } from './create-deck-dialog';

export default async function DashboardPage() {
	const { userId, has } = await auth();

	// Redirect to home if not authenticated
	if (!userId) {
		redirect('/');
	}

	// Fetch user's decks
	const decks = await getUserDecks(userId);

	// Check if user has unlimited decks feature
	const hasUnlimitedDecks = has({ feature: 'unlimited_decks' });
	const deckCount = decks.length;
	const isAtLimit = !hasUnlimitedDecks && deckCount >= 3;
	const isApproachingLimit = !hasUnlimitedDecks && deckCount === 2;

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8 flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Decks</h1>
					<p className='text-muted-foreground'>Manage your flashcard decks</p>
				</div>
				{isAtLimit ? (
					<Button asChild>
						<Link href='/pricing'>Upgrade to Create More Decks</Link>
					</Button>
				) : (
					<CreateDeckDialog />
				)}
			</div>

			{/* Show upgrade prompt for free users approaching or at limit */}
			{!hasUnlimitedDecks && (isApproachingLimit || isAtLimit) && (
				<Card className='mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950'>
					<CardHeader>
						<CardTitle className='text-yellow-900 dark:text-yellow-100'>
							{isAtLimit
								? 'Deck Limit Reached'
								: "You're Almost at Your Limit"}
						</CardTitle>
						<CardDescription className='text-yellow-800 dark:text-yellow-200'>
							{isAtLimit
								? `You've reached the maximum of 3 decks on the free plan.`
								: `You're using ${deckCount} of 3 free decks.`}{' '}
							Upgrade to Pro for unlimited decks and AI-powered flashcard
							generation.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild>
							<Link href='/pricing'>View Pro Plans</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{decks.length === 0 ? (
				<Card className='border-dashed'>
					<CardHeader className='text-center'>
						<CardTitle>No decks yet</CardTitle>
						<CardDescription>
							Get started by creating your first flashcard deck
						</CardDescription>
					</CardHeader>
					<CardContent className='flex justify-center'>
						<CreateDeckDialog>
							<Button>Create Your First Deck</Button>
						</CreateDeckDialog>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{decks.map(deck => (
						<Card
							key={deck.id}
							className='transition-all hover:border-gray-700 hover:shadow-lg'
						>
							<Link
								href={`/decks/${deck.id}`}
								className='no-underline hover:no-underline'
							>
								<CardHeader className='cursor-pointer hover:bg-accent transition-colors'>
									<CardTitle>{deck.name}</CardTitle>
									{deck.description && (
										<CardDescription>{deck.description}</CardDescription>
									)}
								</CardHeader>
							</Link>
							<CardFooter className='flex items-center justify-between'>
								<span className='text-xs text-muted-foreground'>
									Updated at{' '}
									{deck.updatedAt
										? new Date(deck.updatedAt).toLocaleDateString(undefined, {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
										  })
										: 'N/A'}
								</span>
								<Link href={`/decks/${deck.id}/study`}>
									<Button size='sm' variant='default'>
										Study
									</Button>
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
