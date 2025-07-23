
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface KnowledgeArticle {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  content: string; // Full markdown/text content
  tags: string[];
  image: {
    url: string;
    hint: string;
  };
}

export const knowledgeBase: KnowledgeArticle[] = [
  // Beginner Articles
  {
    slug: "what-is-phishing",
    title: "What is Phishing? A Beginner's Guide",
    summary: "Learn to identify and protect yourself from phishing scams, one of the most common online threats.",
    difficulty: "Beginner",
    tags: ["phishing", "email security", "scams"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "hooded hacker"
    },
    content: `
Phishing is a type of cyber attack where attackers impersonate legitimate organizations via email, text message, or other means to steal sensitive information. This can include login credentials, credit card numbers, or other personal details.

**How to Spot a Phishing Attempt:**
- **Check the Sender's Email:** Look for slight misspellings or unusual domain names.
- **Urgent or Threatening Language:** Scammers often create a sense of urgency to rush you into making a mistake.
- **Unexpected Attachments or Links:** Be wary of any links or files you weren't expecting.
- **Generic Greetings:** Legitimate companies will often address you by name.

**What to Do:**
- **Don't click links or download attachments.**
- **Report the email** as phishing through your email client.
- **Delete the message.**
`
  },
  {
    slug: "creating-strong-passwords",
    title: "How to Create Strong & Memorable Passwords",
    summary: "Your password is your first line of defense. Discover the keys to creating passwords that are tough to crack.",
    difficulty: "Beginner",
    tags: ["passwords", "account security"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "digital padlock"
    },
    content: `
A strong password is a critical component of your online security.

**Key Principles:**
- **Length is Strength:** Aim for at least 12-16 characters.
- **Use a Mix of Characters:** Include uppercase letters, lowercase letters, numbers, and symbols.
- **Avoid Personal Information:** Don't use your name, birthday, or common words.
- **Use a Passphrase:** A sequence of random words (e.g., "Correct-Horse-Battery-Staple") is both strong and easier to remember.
- **Use a Password Manager:** These tools can generate and store unique, complex passwords for every site you use.
`
  },
  {
    slug: "understanding-2fa",
    title: "Understanding Two-Factor Authentication (2FA)",
    summary: "Add a powerful extra layer of security to your accounts by enabling Two-Factor Authentication.",
    difficulty: "Beginner",
    tags: ["2fa", "mfa", "account security"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "phone security"
    },
    content: `
Two-Factor Authentication (2FA) adds a second step to your login process, making it much harder for an attacker to gain access to your accounts even if they have your password.

**How it Works:**
After entering your password, you'll be asked for a second piece of information, such as:
- A code from an authenticator app (e.g., Google Authenticator, Authy).
- A code sent to you via SMS (less secure, but better than nothing).
- A physical security key (like a YubiKey).

**Why Use It?**
If a hacker steals your password, they still won't be able to log in without access to your second factor. You should enable 2FA on all important accounts that support it, especially email, banking, and social media.
`
  },
  {
    slug: "recognizing-scam-websites",
    title: "How to Spot a Fake or Scam Website",
    summary: "Learn the tell-tale signs of a fraudulent website before you enter any personal information.",
    difficulty: "Beginner",
    tags: ["scams", "phishing", "browsing safety"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "website warning"
    },
    content: `
Scam websites are designed to trick you into giving away money or personal information. Here are some red flags to watch out for.

**Key Signs of a Scam Website:**
- **Check the URL:** Look for misspellings of popular brands (e.g., "amaz0n.com") or unusual domain extensions (.biz, .info).
- **Look for HTTPS:** A legitimate site, especially one that handles transactions, should have a padlock icon in the address bar, indicating a secure (HTTPS) connection. While not a guarantee of legitimacy, its absence is a major red flag.
- **Poor Design and Grammar:** Many scam sites are put together hastily. Look for spelling mistakes, grammatical errors, and low-quality images.
- **Unbelievable Deals:** If an offer seems too good to be true, it probably is.
- **Lack of Contact Information:** A real business should provide a physical address, phone number, and legitimate contact email.
`
  },
  // Intermediate Articles
  {
    slug: "what-is-malware",
    title: "What is Malware? Viruses, Ransomware & More",
    summary: "Explore the different types of malicious software and learn how they can infect your devices.",
    difficulty: "Intermediate",
    tags: ["malware", "viruses", "ransomware", "spyware"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "computer virus"
    },
    content: `
Malware, short for malicious software, is any software intentionally designed to cause damage to a computer, server, client, or computer network.

**Common Types of Malware:**
- **Viruses:** Attach to clean files and spread to other clean files.
- **Ransomware:** Encrypts your files and demands a ransom for the decryption key.
- **Spyware:** Secretly observes your computer activity and collects personal information.
- **Trojans:** Disguise themselves as legitimate software to trick you into installing them.
- **Adware:** Automatically delivers advertisements, often in a manner that is intrusive.

**Protection:**
- Use reputable antivirus software and keep it updated.
- Be cautious about downloads from untrusted sources.
- Keep your operating system and applications patched and up-to-date.
`
  },
  {
    slug: "safe-browsing-habits",
    title: "Essential Habits for Safe Web Browsing",
    summary: "Go beyond the basics with these essential habits to protect your privacy and security while browsing the web.",
    difficulty: "Intermediate",
    tags: ["browsing", "privacy", "https-everywhere"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "secure browsing"
    },
    content: `
Staying safe online involves developing good habits.

**Key Habits:**
- **Use HTTPS Everywhere:** Ensure your connection to websites is encrypted. Look for the padlock icon in the address bar. Browser extensions like "HTTPS Everywhere" can help.
- **Be Wary of Public Wi-Fi:** Avoid logging into sensitive accounts on public networks. If you must, use a Virtual Private Network (VPN) to encrypt your traffic.
- **Manage Cookies:** Regularly clear your cookies or use browser settings and extensions to block third-party tracking cookies.
- **Think Before You Click:** Be skeptical of pop-ups, online quizzes, and "special offers" that seem too good to be true.
`
  },
  {
    slug: "what-is-a-vpn",
    title: "What is a VPN and Why Should You Use One?",
    summary: "Understand how a Virtual Private Network (VPN) works and how it can protect your online privacy.",
    difficulty: "Intermediate",
    tags: ["vpn", "privacy", "encryption", "networking"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "network security"
    },
    content: `
A Virtual Private Network (VPN) is a service that protects your internet connection and privacy online. It creates an encrypted tunnel for your data, protects your online identity by hiding your IP address, and allows you to use public Wi-Fi hotspots safely.

**How a VPN Works:**
When you connect to the internet through a VPN, your device connects to a server operated by the VPN provider. All your internet traffic is routed through this server and encrypted.
1.  **Hides Your IP Address:** Your real IP address is replaced with the IP address of the VPN server, making it difficult for websites and online services to track your location and browsing habits.
2.  **Encrypts Your Traffic:** The encryption scrambles your data, making it unreadable to anyone who might intercept it, such as your Internet Service Provider (ISP) or attackers on a public Wi-Fi network.

**Why Use a VPN?**
- **Enhanced Privacy:** Prevents your ISP from seeing your browsing activity.
- **Security on Public Wi-Fi:** Protects your data from hackers when you're using coffee shop, airport, or hotel Wi-Fi.
- **Access Geo-Restricted Content:** Can make it appear as if you are browsing from a different country.
`
  },
  // Advanced Articles
  {
    slug: "understanding-encryption",
    title: "A Primer on Encryption",
    summary: "Dive into the concepts of symmetric and asymmetric encryption and understand how it protects your data.",
    difficulty: "Advanced",
    tags: ["encryption", "cryptography", "data security"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "digital encryption"
    },
    content: `
Encryption is the process of converting data into a code to prevent unauthorized access.

**Two Main Types:**
1.  **Symmetric Encryption:** Uses a single key to both encrypt and decrypt data. It's fast and efficient but requires a secure way to share the key. (e.g., AES).
2.  **Asymmetric Encryption (Public-Key Cryptography):** Uses a pair of keys: a public key (which can be shared with anyone) to encrypt data, and a private key (which is kept secret) to decrypt it. It's more secure for communication but slower. (e.g., RSA).

This public-private key pair is the foundation of modern secure communication, including technologies like TLS/SSL that secure website connections (HTTPS).
`
  },
  {
    slug: "supply-chain-attacks",
    title: "An Introduction to Supply Chain Attacks",
    summary: "Learn about a sophisticated threat where attackers compromise software dependencies to infect downstream users.",
    difficulty: "Advanced",
    tags: ["supply-chain", "software security", "vulnerabilities"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "supply chain"
    },
    content: `
A software supply chain attack occurs when an attacker infiltrates a legitimate software development process to inject malicious code. Instead of attacking the end-user directly, they target the third-party vendors, libraries, and dependencies that users trust.

**How it Works:**
An attacker might:
- Inject malicious code into an open-source library on a platform like NPM or PyPI.
- Compromise a vendor's software update mechanism to distribute malware.
- Steal code-signing certificates to make their malicious software appear legitimate.

**Mitigation:**
- Use dependency scanning tools to check for known vulnerabilities.
- Pin dependency versions to prevent unexpected updates.
- Vet third-party vendors and their security practices.
`
  },
  {
    slug: "sql-injection-explained",
    title: "Understanding SQL Injection (SQLi) Attacks",
    summary: "A technical overview of how SQL injection attacks work and why they are a critical threat to web applications.",
    difficulty: "Advanced",
    tags: ["sql", "injection", "web security", "database"],
    image: {
      url: "https://placehold.co/600x400",
      hint: "database attack"
    },
    content: `
SQL Injection (SQLi) is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve. This might include data belonging to other users, or any other data that the application itself is able to access.

**How it Works:**
Web applications often take user input (e.g., from a login form or a search bar) and insert it into a SQL query. An SQLi attack occurs when an attacker provides specially crafted input that changes the structure of the query itself.

For example, a query might be:
\`SELECT * FROM users WHERE username = '[userInput]';\`

An attacker could enter \`' OR '1'='1\` as the userInput. The resulting query becomes:
\`SELECT * FROM users WHERE username = '' OR '1'='1';\`

Since \`'1'='1'\` is always true, this could return all rows from the \`users\` table, bypassing authentication.

**Prevention:**
The most effective way to prevent SQLi is to use **prepared statements** (with parameterized queries). These separate the query structure from the user-supplied data, ensuring that input cannot alter the query's intent. Input validation and sanitization are also important layers of defense.
`
  }
];
