import { db } from '@/db';
import { decksTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get all decks for a specific user
 */
export async function getUserDecks(userId: string) {
	return await db
		.select()
		.from(decksTable)
		.where(eq(decksTable.userId, userId));
}

/**
 * Get a specific deck by ID, ensuring it belongs to the user
 */
export async function getDeckById(deckId: number, userId: string) {
	const [deck] = await db
		.select()
		.from(decksTable)
		.where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));

	return deck;
}

/**
 * Create a new deck for a user
 */
export async function createDeck(data: {
	userId: string;
	name: string;
	description?: string;
}) {
	const [deck] = await db.insert(decksTable).values(data).returning();

	return deck;
}

/**
 * Update a deck's information
 */
export async function updateDeck(
	deckId: number,
	userId: string,
	data: { name?: string; description?: string }
) {
	const [deck] = await db
		.update(decksTable)
		.set(data)
		.where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
		.returning();

	return deck;
}

/**
 * Delete a deck (and all its cards due to cascade)
 */
export async function deleteDeck(deckId: number, userId: string) {
	await db
		.delete(decksTable)
		.where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));
}

