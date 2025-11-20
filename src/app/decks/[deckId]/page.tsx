import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getDeckById, getDeckCards } from '@/db/queries';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddCardDialog } from './add-card-dialog';
import { EditCardDialog } from './edit-card-dialog';
import { EditDeckDialog } from './edit-deck-dialog';
import { DeleteDeckDialog } from './delete-deck-dialog';

interface DeckPageProps {
	params: Promise<{ deckId: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
	const { userId } = await auth();

	// Redirect to home if not authenticated
	if (!userId) {
		redirect('/');
	}

	const { deckId } = await params;
	const deckIdNum = parseInt(deckId, 10);

	// Validate deck ID
	if (isNaN(deckIdNum)) {
		notFound();
	}

	// Fetch deck and verify ownership
	const deck = await getDeckById(deckIdNum, userId);

	if (!deck) {
		notFound();
	}

	// Fetch cards for this deck
	const cards = await getDeckCards(deckIdNum, userId);

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Header */}
			<div className='mb-8'>
				<Link href='/dashboard'>
					<Button variant='ghost' size='sm' className='mb-4'>
						← Back to Dashboard
					</Button>
				</Link>

				<div className='flex items-start justify-between'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>{deck.name}</h1>
						{deck.description && (
							<p className='text-muted-foreground mt-2'>{deck.description}</p>
						)}
						<p className='text-sm text-muted-foreground mt-2'>
							{cards.length} {cards.length === 1 ? 'card' : 'cards'} • Updated{' '}
							{new Date(deck.updatedAt).toLocaleDateString()}
						</p>
					</div>
					<div className='flex gap-2'>
						<EditDeckDialog
							deckId={deckIdNum}
							currentName={deck.name}
							currentDescription={deck.description || undefined}
						/>
						<DeleteDeckDialog
							deckId={deckIdNum}
							deckName={deck.name}
							cardCount={cards.length}
						/>
					</div>
				</div>
			</div>

		{/* Cards Section Header */}
		<div className='flex items-center justify-between mb-4'>
			<h2 className='text-2xl font-semibold'>Cards</h2>
			<div className='flex gap-2'>
				<Link href={`/decks/${deckIdNum}/study`}>
					<Button variant='outline'>Study Deck</Button>
				</Link>
				<AddCardDialog deckId={deckIdNum} />
			</div>
		</div>

			{/* Cards */}
			{cards.length === 0 ? (
				<Card className='border-dashed'>
					<CardHeader className='text-center'>
						<CardTitle>No cards yet</CardTitle>
						<CardDescription>
							Start building your deck by adding flashcards
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{cards.map(card => (
						<Card
							key={card.id}
							className='transition-all hover:border-gray-700 hover:shadow-lg'
						>
							<CardHeader>
								<div className='flex items-start justify-between'>
									<div className='flex-1'>
										<CardTitle className='text-base font-medium'>
											Front
										</CardTitle>
										<CardDescription className='text-foreground'>
											{card.front}
										</CardDescription>
									</div>
									<EditCardDialog deckId={deckIdNum} card={card} />
								</div>
							</CardHeader>
							<CardContent>
								<div className='pt-4 border-t'>
									<p className='text-sm font-medium text-muted-foreground mb-2'>
										Back
									</p>
									<p className='text-sm'>{card.back}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
