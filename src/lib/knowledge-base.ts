
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
      url: "https://placehold.co/600x400.png",
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
      url: "https://placehold.co/600x400.png",
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
      url: "https://placehold.co/600x400.png",
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
  // Intermediate Articles
  {
    slug: "what-is-malware",
    title: "What is Malware? Viruses, Ransomware & More",
    summary: "Explore the different types of malicious software and learn how they can infect your devices.",
    difficulty: "Intermediate",
    tags: ["malware", "viruses", "ransomware", "spyware"],
    image: {
      url: "https://placehold.co/600x400.png",
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
      url: "https://placehold.co/600x400.png",
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
  // Advanced Articles
  {
    slug: "understanding-encryption",
    title: "A Primer on Encryption",
    summary: "Dive into the concepts of symmetric and asymmetric encryption and understand how it protects your data.",
    difficulty: "Advanced",
    tags: ["encryption", "cryptography", "data security"],
    image: {
      url: "https://placehold.co/600x400.png",
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
      url: "https://placehold.co/600x400.png",
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
  }
];
