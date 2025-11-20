import 'dotenv/config';
import { createDeck, createCards } from './src/db/queries';

const userId = 'user_35S7DBaLlvlzXLrYzO0TN5doVhH';

async function seedExampleDecks() {
	console.log('Starting to seed example decks...');

	try {
		// Deck 1: English to Spanish
		console.log('Creating English-Spanish deck...');
		const spanishDeck = await createDeck({
			userId,
			name: 'Learning Spanish from English',
			description: 'Common English words and their Spanish translations',
		});

		console.log(`Created deck: ${spanishDeck.name} (ID: ${spanishDeck.id})`);

		// Spanish vocabulary cards
		const spanishCards = [
			{ front: 'Hello', back: 'Hola' },
			{ front: 'Goodbye', back: 'Adiós' },
			{ front: 'Please', back: 'Por favor' },
			{ front: 'Thank you', back: 'Gracias' },
			{ front: 'Yes', back: 'Sí' },
			{ front: 'No', back: 'No' },
			{ front: 'Water', back: 'Agua' },
			{ front: 'Food', back: 'Comida' },
			{ front: 'House', back: 'Casa' },
			{ front: 'Car', back: 'Coche / Carro' },
			{ front: 'Dog', back: 'Perro' },
			{ front: 'Cat', back: 'Gato' },
			{ front: 'Friend', back: 'Amigo / Amiga' },
			{ front: 'Family', back: 'Familia' },
			{ front: 'Love', back: 'Amor' },
		];

		await createCards(
			spanishCards.map(card => ({
				deckId: spanishDeck.id,
				front: card.front,
				back: card.back,
			}))
		);

		console.log(`Added ${spanishCards.length} cards to Spanish deck`);

		// Deck 2: British History
		console.log('Creating British History deck...');
		const historyDeck = await createDeck({
			userId,
			name: 'British History',
			description: 'Important events and dates in British history',
		});

		console.log(`Created deck: ${historyDeck.name} (ID: ${historyDeck.id})`);

		// British history cards
		const historyCards = [
			{
				front: 'When was the Battle of Hastings?',
				back: '1066 - William the Conqueror defeated King Harold II',
			},
			{
				front: 'When was the Magna Carta signed?',
				back: '1215 - King John signed it at Runnymede',
			},
			{
				front: 'When did the Wars of the Roses begin?',
				back: '1455 - Civil war between the House of Lancaster and House of York',
			},
			{
				front: 'When did Henry VIII break from the Catholic Church?',
				back: '1534 - He established the Church of England',
			},
			{
				front: 'When did Elizabeth I reign?',
				back: '1558-1603 - The Elizabethan Era, considered a golden age',
			},
			{
				front: 'When was the Spanish Armada defeated?',
				back: '1588 - English fleet defeated the Spanish invasion',
			},
			{
				front: 'When did the English Civil War begin?',
				back: '1642 - War between Parliamentarians and Royalists',
			},
			{
				front: 'When was Charles I executed?',
				back: '1649 - He was beheaded for high treason',
			},
			{
				front: 'When did the Great Fire of London occur?',
				back: '1666 - Destroyed much of medieval London',
			},
			{
				front: 'When was the Act of Union with Scotland?',
				back: '1707 - Created the Kingdom of Great Britain',
			},
			{
				front: 'When did Queen Victoria reign?',
				back: '1837-1901 - The Victorian Era, period of industrial expansion',
			},
			{
				front: 'When did World War I begin for Britain?',
				back: '1914 - Britain declared war on Germany on August 4',
			},
			{
				front: 'When did World War II begin for Britain?',
				back: '1939 - Britain declared war on Germany on September 3',
			},
			{
				front: 'When did Elizabeth II become queen?',
				back: '1952 - She reigned until 2022, the longest-reigning British monarch',
			},
			{
				front: 'When did Brexit officially happen?',
				back: '2020 - The UK officially left the European Union on January 31',
			},
		];

		await createCards(
			historyCards.map(card => ({
				deckId: historyDeck.id,
				front: card.front,
				back: card.back,
			}))
		);

		console.log(`Added ${historyCards.length} cards to British History deck`);

		console.log('\n✅ Successfully seeded example decks!');
		console.log(`Total decks created: 2`);
		console.log(
			`Total cards created: ${spanishCards.length + historyCards.length}`
		);
	} catch (error) {
		console.error('Error seeding decks:', error);
		throw error;
	}
}

seedExampleDecks()
	.then(() => {
		console.log('\nSeed script completed successfully');
		process.exit(0);
	})
	.catch(error => {
		console.error('\nSeed script failed:', error);
		process.exit(1);
	});
