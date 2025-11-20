'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
	createCard,
	updateCard,
	deleteCard,
	getDeckById,
	updateDeck,
	deleteDeck,
} from '@/db/queries';
import { revalidatePath } from 'next/cache';

// Validation schemas
const cardSchema = z.object({
	front: z.string().min(1, 'Front side is required').max(1000),
	back: z.string().min(1, 'Back side is required').max(1000),
});

const deckSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	description: z.string().max(500).optional(),
});

type CardInput = z.infer<typeof cardSchema>;
type DeckInput = z.infer<typeof deckSchema>;

type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

/**
 * Create a new card in a deck
 */
export async function createCardAction(
	deckId: number,
	data: CardInput
): Promise<ActionResult<{ id: number }>> {
	try {
		const { userId } = await auth();

		if (!userId) {
			redirect('/');
		}

		// Verify the deck exists and belongs to the user
		const deck = await getDeckById(deckId, userId);

		if (!deck) {
			return { success: false, error: 'Deck not found' };
		}

		// Validate input
		const validatedData = cardSchema.parse(data);

		// Create card
		const card = await createCard({
			deckId,
			front: validatedData.front,
			back: validatedData.back,
		});

		// Revalidate the deck page to show the new card
		revalidatePath(`/decks/${deckId}`);

		return { success: true, data: { id: card.id } };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message ?? 'Invalid input',
			};
		}
		return { success: false, error: 'Failed to create card' };
	}
}

/**
 * Update an existing card
 */
export async function updateCardAction(
	cardId: number,
	deckId: number,
	data: CardInput
): Promise<ActionResult<{ id: number }>> {
	try {
		const { userId } = await auth();

		if (!userId) {
			redirect('/');
		}

		// Validate input
		const validatedData = cardSchema.parse(data);

		// Update card (updateCard verifies ownership)
		const updatedCard = await updateCard(cardId, userId, {
			front: validatedData.front,
			back: validatedData.back,
		});

		if (!updatedCard) {
			return { success: false, error: 'Card not found or unauthorized' };
		}

		// Revalidate the deck page to show the updated card
		revalidatePath(`/decks/${deckId}`);

		return { success: true, data: { id: updatedCard.id } };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message ?? 'Invalid input',
			};
		}
		return { success: false, error: 'Failed to update card' };
	}
}

/**
 * Delete a card
 */
export async function deleteCardAction(
	cardId: number,
	deckId: number
): Promise<ActionResult<null>> {
	try {
		const { userId } = await auth();

		if (!userId) {
			redirect('/');
		}

		// Delete card (deleteCard verifies ownership)
		const success = await deleteCard(cardId, userId);

		if (!success) {
			return { success: false, error: 'Card not found or unauthorized' };
		}

		// Revalidate the deck page
		revalidatePath(`/decks/${deckId}`);

		return { success: true, data: null };
	} catch (error) {
		return { success: false, error: 'Failed to delete card' };
	}
}

/**
 * Update a deck's information
 */
export async function updateDeckAction(
	deckId: number,
	data: DeckInput
): Promise<ActionResult<{ id: number }>> {
	try {
		const { userId } = await auth();

		if (!userId) {
			redirect('/');
		}

		// Validate input
		const validatedData = deckSchema.parse(data);

		// Update deck (updateDeck verifies ownership)
		const updatedDeck = await updateDeck(deckId, userId, {
			name: validatedData.name,
			description: validatedData.description,
		});

		if (!updatedDeck) {
			return { success: false, error: 'Deck not found or unauthorized' };
		}

		// Revalidate the deck page and dashboard
		revalidatePath(`/decks/${deckId}`);
		revalidatePath('/dashboard');

		return { success: true, data: { id: updatedDeck.id } };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message ?? 'Invalid input',
			};
		}
		return { success: false, error: 'Failed to update deck' };
	}
}

/**
 * Delete a deck and all its associated cards
 * Note: Cards are automatically deleted via database CASCADE
 */
export async function deleteDeckAction(
	deckId: number
): Promise<ActionResult<null>> {
	try {
		const { userId } = await auth();

		if (!userId) {
			redirect('/');
		}

		// Verify the deck exists and belongs to the user before deleting
		const deck = await getDeckById(deckId, userId);

		if (!deck) {
			return { success: false, error: 'Deck not found or unauthorized' };
		}

		// Delete deck (this will cascade delete all cards automatically)
		await deleteDeck(deckId, userId);

		// Revalidate the dashboard to remove the deleted deck from the list
		revalidatePath('/dashboard');

		return { success: true, data: null };
	} catch (error) {
		return { success: false, error: 'Failed to delete deck' };
	}
}

