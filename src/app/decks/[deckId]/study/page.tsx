import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getDeckById, getDeckCards } from '@/db/queries';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StudyFlashcards } from './study-flashcards';

interface StudyPageProps {
	params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
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
				<Link href={`/decks/${deckIdNum}`}>
					<Button variant='ghost' size='sm' className='mb-4'>
						← Back to Deck
					</Button>
				</Link>

				<div className='flex items-start justify-between'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							Study: {deck.name}
						</h1>
						{deck.description && (
							<p className='text-muted-foreground mt-2'>{deck.description}</p>
						)}
					</div>
				</div>
			</div>

			{/* Flashcards Study Interface */}
			{cards.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-12'>
					<p className='text-muted-foreground mb-4'>
						No cards to study yet. Add some cards to get started!
					</p>
					<Link href={`/decks/${deckIdNum}`}>
						<Button>Go to Deck</Button>
					</Link>
				</div>
			) : (
				<StudyFlashcards cards={cards} deckId={deckIdNum} />
			)}
		</div>
	);
}

