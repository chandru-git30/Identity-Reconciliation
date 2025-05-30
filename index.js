const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

function formatResponse(primary, contacts) {
  const emails = [...new Set(contacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(contacts.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = contacts
    .filter(c => c.linkPrecedence === 'secondary')
    .map(c => c.id);

  return {
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
}

app.post('/identify', async (req, res) => {
  console.log("---->getting in");
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phone number required.' });
  }

  try {
    // Step 1: Find all contacts that match either email or phoneNumber
    const matchedContacts = await prisma.contact.findMany({
      where: {
        OR: [
          email ? { email } : undefined,
          phoneNumber ? { phoneNumber } : undefined,
        ].filter(Boolean),
      },
      orderBy: { createdAt: 'asc' },
    });

    // Step 2: Find all primaries from matched contacts
    const primaryContacts = matchedContacts.filter(c => c.linkPrecedence === 'primary');

    // Step 3: If no matching primary exists, create one
    if (primaryContacts.length === 0) {
      const newPrimary = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary',
        },
      });
      return res.status(200).json(formatResponse(newPrimary, [newPrimary]));
    }

    // Step 4: Pick the oldest primary contact as the main one
    const mainPrimary = primaryContacts.reduce((oldest, curr) =>
      new Date(curr.createdAt) < new Date(oldest.createdAt) ? curr : oldest
    );

    // Step 5: Convert other primaries to secondaries
    const otherPrimaries = primaryContacts.filter(c => c.id !== mainPrimary.id);

    for (const contact of otherPrimaries) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkPrecedence: 'secondary',
          linkedId: mainPrimary.id,
        },
      });
    }

    // Step 6: Check if exact email + phoneNumber combo exists
    const exactMatch = matchedContacts.find(c => c.email === email && c.phoneNumber === phoneNumber);

    if (!exactMatch) {
      // Create new secondary contact if not exact match
      await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: mainPrimary.id,
        },
      });
    }

    // Step 7: Fetch all contacts linked to the main primary
    const allLinkedContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: mainPrimary.id },
          { linkedId: mainPrimary.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json(formatResponse(mainPrimary, allLinkedContacts));
  } catch (error) {
    console.error('Error in /identify:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
