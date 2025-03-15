# TechQuest

Interaktywna platforma edukacyjna do nauki matematyki, wykorzystująca nowoczesne technologie webowe i sztuczną inteligencję.

[Prezentacja](https://gamma.app/docs/TechQuest-2025-MathProdigy-oxum79gmzmv8o9l?mode=present)

## 🏆 Zwycięzcy TechQuest 2025

Projekt zdobył **1. miejsce** w kategorii "App Create" podczas 24-godzinnego hakatonu TechQuest 2025 w Leżajsku.

### 👥 Autorzy
- Majcher Kacper
- Danicki Marcin
- Kowalski Kacper
- Kiełt Mateusz
- Krzanowski Filip

## Kompilacja i uruchamianie

1. Zainstaluj pnpm globalnie używając npm:
```bash
npm install -g pnpm
```

2. Zainstaluj zależności:
```bash
pnpm install
```

3. Skonfiguruj zmienne środowiskowe:
   - Skopiuj plik `.env.example` do `.env`
   - Uzupełnij wymagane zmienne środowiskowe

4. Zainicjalizuj bazę danych:
```bash
pnpm prisma db push
```

6. Skompiluj projekt:
```bash
pnpm run build
```

6. Uruchom serwer nextjs:
```bash
pnpm run start
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## Zestaw technologii

### Frontend

- **Next.js 15** - Framework React z obsługą Server Components i App Router
- **React 19** - Biblioteka do budowania interfejsów użytkownika
- **TypeScript** - Typowany JavaScript dla lepszej jakości kodu
- **Tailwind CSS** - Utility-first framework CSS
- **Shadcn/UI** - Komponenty UI zbudowane na Radix UI i Tailwind CSS
- **Lucide React** - Zestaw ikon SVG

### Backend

- **Next.js API Routes** - Serverless funkcje API
- **Prisma** - ORM (Object-Relational Mapping) dla baz danych
- **PostgreSQL (Neon Tech)** - Serverless relacyjna baza danych w chmurze
- **Server Actions** - Funkcje serwerowe zintegrowane z komponentami

### Autentykacja i Autoryzacja

- **Clerk** - Kompletne rozwiązanie do autentykacji i zarządzania użytkownikami

### Funkcje AI

- **OpenRouter API** - Dostęp do różnych modeli AI, w tym GPT-4o
- **AI SDK** - Narzędzia do integracji AI z aplikacją

### Infrastruktura

- **Vercel** - Platforma hostingowa dla aplikacji Next.js
- **Neon Tech** - Serverless PostgreSQL w chmurze

### Narzędzia deweloperskie

- **ESLint** - Statyczna analiza kodu
- **Prettier** - Formatowanie kodu
- **pnpm** - Szybki i wydajny menedżer pakietów

## Architektura

Aplikacja wykorzystuje nowoczesną architekturę Next.js z App Router, która łączy zalety renderowania po stronie serwera (SSR) i komponentów klienta. Główne elementy architektury:

1. **Server Components** - Renderowane na serwerze, zmniejszają ilość JavaScript wysyłanego do klienta
2. **Client Components** - Interaktywne komponenty renderowane w przeglądarce
3. **Server Actions** - Funkcje serwerowe wywoływane bezpośrednio z komponentów klienckich
4. **API Routes** - Endpointy API dla operacji serwerowych
5. **Prisma Schema** - Definicja modelu danych i relacji w bazie danych

## Funkcje statystyk użytkownika

System statystyk użytkownika śledzi postępy w nauce:

- **Ukończone tematy** - Śledzenie ukończonych tematów i podtematów
- **Rozwiązane zadania** - Liczba rozwiązanych zadań matematycznych
- **Aktywność** - Historia ostatnich działań użytkownika
- **Streak** - Liczba dni z rzędu, w których użytkownik korzystał z platformy

Dane statystyczne są przechowywane w bazie danych PostgreSQL i aktualizowane za pomocą Server Actions.
