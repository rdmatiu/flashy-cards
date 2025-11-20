'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import Link from 'next/link';

interface Card {
	id: number;
	deckId: number;
	front: string;
	back: string;
	createdAt: Date;
	updatedAt: Date;
}

interface StudyFlashcardsProps {
	cards: Card[];
	deckId: number;
}

export function StudyFlashcards({ cards, deckId }: StudyFlashcardsProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
	const [shuffledCards, setShuffledCards] = useState(cards);
	const [results, setResults] = useState<Map<number, 'correct' | 'incorrect'>>(
		new Map()
	);
	const [isCompleted, setIsCompleted] = useState(false);

	const currentCard = shuffledCards[currentIndex];
	const totalCards = shuffledCards.length;
	const progress = ((studiedCards.size / totalCards) * 100).toFixed(0);
	const correctCount = Array.from(results.values()).filter(
		r => r === 'correct'
	).length;
	const incorrectCount = Array.from(results.values()).filter(
		r => r === 'incorrect'
	).length;

	// Keyboard navigation
	useEffect(() => {
		// Don't enable keyboard shortcuts when study session is completed
		if (isCompleted) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault();
					// Navigate to previous card
					setCurrentIndex(prev => {
						if (prev > 0) {
							setIsFlipped(false);
							return prev - 1;
						}
						return prev;
					});
					break;
				case 'ArrowRight':
					event.preventDefault();
					// Navigate to next card
					setCurrentIndex(prev => {
						if (prev < totalCards - 1) {
							setIsFlipped(false);
							return prev + 1;
						}
						return prev;
					});
					break;
				case ' ':
					event.preventDefault();
					// Flip the card
					setIsFlipped(prev => {
						if (!prev) {
							// Mark card as studied when flipping to see the answer
							setStudiedCards(prevStudied =>
								new Set(prevStudied).add(shuffledCards[currentIndex].id)
							);
						}
						return !prev;
					});
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [currentIndex, totalCards, shuffledCards, isCompleted]);

	const handleFlip = () => {
		setIsFlipped(!isFlipped);
		if (!isFlipped) {
			// Mark card as studied when flipped to see the answer
			setStudiedCards(prev => new Set(prev).add(currentCard.id));
		}
	};

	const handleNext = () => {
		if (currentIndex < totalCards - 1) {
			setCurrentIndex(currentIndex + 1);
			setIsFlipped(false);
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			setIsFlipped(false);
		}
	};

	const handleShuffle = () => {
		const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
		setShuffledCards(shuffled);
		setCurrentIndex(0);
		setIsFlipped(false);
		setStudiedCards(new Set());
		setResults(new Map());
		setIsCompleted(false);
	};

	const handleReset = () => {
		setCurrentIndex(0);
		setIsFlipped(false);
		setStudiedCards(new Set());
		setResults(new Map());
		setIsCompleted(false);
	};

	const handleMarkCorrect = () => {
		const newResults = new Map(results);
		newResults.set(currentCard.id, 'correct');
		setResults(newResults);
		const newStudiedCards = new Set(studiedCards).add(currentCard.id);
		setStudiedCards(newStudiedCards);

		// Check if this was the last card
		if (newStudiedCards.size === totalCards) {
			setIsCompleted(true);
		} else if (currentIndex < totalCards - 1) {
			// Auto-advance to next card
			setCurrentIndex(currentIndex + 1);
			setIsFlipped(false);
		}
	};

	const handleMarkIncorrect = () => {
		const newResults = new Map(results);
		newResults.set(currentCard.id, 'incorrect');
		setResults(newResults);
		const newStudiedCards = new Set(studiedCards).add(currentCard.id);
		setStudiedCards(newStudiedCards);

		// Check if this was the last card
		if (newStudiedCards.size === totalCards) {
			setIsCompleted(true);
		} else if (currentIndex < totalCards - 1) {
			// Auto-advance to next card
			setCurrentIndex(currentIndex + 1);
			setIsFlipped(false);
		}
	};

	// Show completion summary if study session is complete
	if (isCompleted) {
		return (
			<div className='max-w-3xl mx-auto'>
				<Card className='p-8 text-center'>
					<div className='mb-6'>
						<p className='text-3xl font-bold mb-2'>🎉 Study Complete!</p>
						<p className='text-lg text-muted-foreground'>
							Great job finishing the deck!
						</p>
					</div>

					<div className='mb-8'>
						<p className='text-6xl font-bold mb-4'>
							{correctCount} / {totalCards}
						</p>
						<p className='text-2xl font-semibold text-muted-foreground mb-6'>
							{totalCards > 0
								? Math.round((correctCount / totalCards) * 100)
								: 0}
							% Correct
						</p>
						<div className='flex justify-center gap-8 text-lg'>
							<div className='p-4 bg-green-50 dark:bg-green-950 rounded-lg'>
								<span className='text-green-600 font-bold text-3xl block mb-2'>
									✓ {correctCount}
								</span>
								<p className='text-muted-foreground'>Correct</p>
							</div>
							<div className='p-4 bg-red-50 dark:bg-red-950 rounded-lg'>
								<span className='text-red-600 font-bold text-3xl block mb-2'>
									✗ {incorrectCount}
								</span>
								<p className='text-muted-foreground'>Incorrect</p>
							</div>
						</div>
					</div>

					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button onClick={handleShuffle} size='lg' variant='outline'>
							🔀 Study Again (Shuffled)
						</Button>
						<Button onClick={handleReset} size='lg' variant='outline'>
							🔄 Restart Session
						</Button>
						<Link href={`/decks/${deckId}`}>
							<Button size='lg' variant='secondary'>
								Back to Deck
							</Button>
						</Link>
						<Link href='/dashboard'>
							<Button size='lg'>Go to Dashboard</Button>
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className='max-w-3xl mx-auto'>
			{/* Keyboard Shortcuts Hint */}
			<div className='mb-4 p-3 bg-muted/50 rounded-lg border border-border'>
				<div className='flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground'>
					<div className='flex items-center gap-2'>
						<kbd className='px-2 py-1 bg-background border border-border rounded font-mono font-semibold'>
							←
						</kbd>
						<span>Previous</span>
					</div>
					<div className='flex items-center gap-2'>
						<kbd className='px-2 py-1 bg-background border border-border rounded font-mono font-semibold'>
							→
						</kbd>
						<span>Next</span>
					</div>
					<div className='flex items-center gap-2'>
						<kbd className='px-2 py-1 bg-background border border-border rounded font-mono font-semibold'>
							Space
						</kbd>
						<span>Flip</span>
					</div>
				</div>
			</div>

			{/* Progress Bar */}
			<div className='mb-6'>
				<div className='flex justify-between items-center mb-2'>
					<span className='text-sm font-medium'>Progress</span>
					<div className='flex gap-4 text-sm text-muted-foreground'>
						<span className='text-green-600 font-medium'>✓ {correctCount}</span>
						<span className='text-red-600 font-medium'>✗ {incorrectCount}</span>
						<span>
							{studiedCards.size} / {totalCards}
						</span>
					</div>
				</div>
				<div className='w-full bg-secondary rounded-full h-2'>
					<div
						className='bg-primary rounded-full h-2 transition-all duration-300'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Flashcard */}
			<Card className='mb-6 min-h-[400px] flex flex-col'>
				<CardHeader className='text-center'>
					<div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
						<span>
							Card {currentIndex + 1} of {totalCards}
						</span>
						{results.has(currentCard.id) && (
							<span
								className={`font-semibold ${
									results.get(currentCard.id) === 'correct'
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{results.get(currentCard.id) === 'correct' ? '✓' : '✗'}
							</span>
						)}
					</div>
				</CardHeader>
				<CardContent className='flex-1 flex items-center justify-center p-8'>
					<div
						className='cursor-pointer w-full text-center'
						onClick={handleFlip}
					>
						<div className='text-sm font-medium text-muted-foreground mb-4'>
							{isFlipped ? 'Back' : 'Front'}
						</div>
						<div className='text-2xl font-semibold leading-relaxed'>
							{isFlipped ? currentCard.back : currentCard.front}
						</div>
						<div className='text-sm text-muted-foreground mt-4'>
							{!isFlipped ? 'Click to reveal answer' : 'Did you get it right?'}
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex justify-center gap-3'>
					{!isFlipped ? (
						<Button variant='outline' onClick={handleFlip} size='lg'>
							Show Back
						</Button>
					) : (
						<>
							<Button
								variant='destructive'
								onClick={handleMarkIncorrect}
								size='lg'
								className='flex-1 max-w-[200px]'
							>
								✗ Incorrect
							</Button>
							<Button
								variant='default'
								onClick={handleMarkCorrect}
								size='lg'
								className='flex-1 max-w-[200px] bg-green-600 hover:bg-green-700'
							>
								✓ Correct
							</Button>
						</>
					)}
				</CardFooter>
			</Card>

			{/* Navigation Controls */}
			<div className='flex flex-col sm:flex-row gap-4 mb-6'>
				<div className='flex gap-2 flex-1'>
					<Button
						variant='outline'
						onClick={handlePrevious}
						disabled={currentIndex === 0}
						className='flex-1'
					>
						← Previous
					</Button>
					<Button
						onClick={handleNext}
						disabled={currentIndex === totalCards - 1}
						className='flex-1'
					>
						Next →
					</Button>
				</div>
			</div>

			{/* Action Buttons */}
			<div className='flex flex-col sm:flex-row gap-4'>
				<Button variant='outline' onClick={handleShuffle} className='flex-1'>
					🔀 Shuffle Cards
				</Button>
				<Button variant='outline' onClick={handleReset} className='flex-1'>
					🔄 Reset Progress
				</Button>
				<Link href={`/decks/${deckId}`} className='flex-1'>
					<Button variant='secondary' className='w-full'>
						Finish Studying
					</Button>
				</Link>
			</div>
		</div>
	);
}
