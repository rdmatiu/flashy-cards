'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createDeck, getUserDecks } from '@/db/queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Define Zod schema for deck creation
const createDeckSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	description: z
		.string()
		.max(1000, 'Description is too long')
		.optional()
		.transform(val => (val === '' ? undefined : val)),
});

// Define TypeScript type from schema
type CreateDeckInput = z.infer<typeof createDeckSchema>;

// Define action result type
type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

/**
 * Server action to create a new deck
 */
export async function createDeckAction(
	data: CreateDeckInput
): Promise<ActionResult<{ id: number; name: string }>> {
	try {
		const { userId, has } = await auth();

		if (!userId) {
			redirect('/');
		}

		// Check if user has unlimited decks feature
		const hasUnlimitedDecks = has({ feature: 'unlimited_decks' });

		if (!hasUnlimitedDecks) {
			// Check if user has reached the 3-deck limit
			const existingDecks = await getUserDecks(userId);

			if (existingDecks.length >= 3) {
				return {
					success: false,
					error:
						'You have reached the maximum of 3 decks on the free plan. Upgrade to Pro for unlimited decks.',
				};
			}
		}

		// Validate input
		const validatedData = createDeckSchema.parse(data);

		// Use query function to create deck
		const deck = await createDeck({
			userId,
			name: validatedData.name,
			description: validatedData.description,
		});

		// Revalidate the dashboard page to show the new deck
		revalidatePath('/dashboard');

		return {
			success: true,
			data: { id: deck.id, name: deck.name },
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.issues[0]?.message ?? 'Invalid input' };
		}
		return { success: false, error: 'Failed to create deck' };
	}
}
