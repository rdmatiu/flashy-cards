import { db } from '@/db';
import { cardsTable, decksTable } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Get all cards for a specific deck
 */
export async function getDeckCards(deckId: number, userId: string) {
	// First verify the deck belongs to the user
	const [deck] = await db
		.select()
		.from(decksTable)
		.where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));

	if (!deck) {
		return [];
	}

	return await db
		.select()
		.from(cardsTable)
		.where(eq(cardsTable.deckId, deckId))
		.orderBy(desc(cardsTable.updatedAt));
}

/**
 * Get a specific card by ID, ensuring the deck belongs to the user
 */
export async function getCardById(cardId: number, userId: string) {
	const [card] = await db
		.select({
			id: cardsTable.id,
			deckId: cardsTable.deckId,
			front: cardsTable.front,
			back: cardsTable.back,
			createdAt: cardsTable.createdAt,
			updatedAt: cardsTable.updatedAt,
		})
		.from(cardsTable)
		.innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
		.where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)));

	return card;
}

/**
 * Create a new card in a deck
 */
export async function createCard(data: {
	deckId: number;
	front: string;
	back: string;
}) {
	const [card] = await db.insert(cardsTable).values(data).returning();

	return card;
}

/**
 * Create multiple cards in a deck at once
 */
export async function createCards(
	cards: Array<{
		deckId: number;
		front: string;
		back: string;
	}>
) {
	return await db.insert(cardsTable).values(cards).returning();
}

/**
 * Update a card's content
 */
export async function updateCard(
	cardId: number,
	userId: string,
	data: { front?: string; back?: string }
) {
	// First verify the card's deck belongs to the user
	const card = await getCardById(cardId, userId);

	if (!card) {
		return null;
	}

	const [updatedCard] = await db
		.update(cardsTable)
		.set(data)
		.where(eq(cardsTable.id, cardId))
		.returning();

	return updatedCard;
}

/**
 * Delete a card
 */
export async function deleteCard(cardId: number, userId: string) {
	// First verify the card's deck belongs to the user
	const card = await getCardById(cardId, userId);

	if (!card) {
		return false;
	}

	await db.delete(cardsTable).where(eq(cardsTable.id, cardId));

	return true;
}
