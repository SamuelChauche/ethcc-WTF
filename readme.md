# Task: EthCC Cannes 2026 Photo Directory

## Objective
Create an interactive HTML page in **a single file** that works as a recognition game for key Web3 figures attending EthCC Cannes 2026.

---

## Research (web search required)
Before coding, use web search to find **all real speakers** who will be at EthCC Cannes 2026:
- Search: `EthCC 2026 Cannes speakers sponsors`
- Search: `EthCC 2026 confirmed speakers`
- For each person, retrieve: **full name**, **project/organization**, **role** (speaker or sponsor), and **official photo URL** (Twitter/X profile photo, or conference photo)

---

## Game Mechanics

### Data Structure
Build a JS array of objects `{ name, project, role, photo, sector }` where:
- `photo` = direct URL to their real photo (Twitter, LinkedIn, official site) or local file
- `sector` = a brief description of their role and project

### Flow
1. Display the person's photo prominently
2. Show two name choices (one correct, one decoy of the same gender)
3. If **wrong choice** -> red error message with the correct answer + sector info + "Next ->" button
4. If **correct choice** -> green congratulations message + confetti animation + "Next ->" button
5. At the end -> final score screen

---

## Design
**Dark crypto / Web3** aesthetic:
- Dark background (black or deep night blue)
- Neon accents (violet, cyan, or orange)
- Distinctive font — no Inter or Arial
- Photos in circle or hexagon with glow effect
- Smooth transitions between cards
- Progress bar at the top (1/N, 2/N, etc.)
- Visible score counter
- Polished CSS animations (card entrance, shake on error, pulse on success)

---

## Technical Constraints
- **Single HTML file** — self-contained
- Vanilla JS only (no framework)
- CSS in `<style>` in the `<head>`
- JS in `<script>` before `</body>`
- Photos load from external URLs or local files (provide a fallback avatar if the photo fails to load)
- Desktop and mobile compatible

---

## Deliverable
A file `ethcc-trombinoscope.html` ready to open in a browser, with all real EthCC 2026 speakers, functional without a server.
