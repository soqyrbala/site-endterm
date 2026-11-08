# Steppe & Peaks – Endterm Project

**Topic:** travel agency website about Kazakhstan (continuation of the midterm project, same topic and group).

**Live site:** 

## Group members

| Name | Contribution |
|------|--------------|
|_Saginbek_Mansur_| _e.g. destinations page: filters, favorites, booking form validation,gallery lightbox, jQuery effects_ |


## What was kept from the midterm

All five pages (`index`, `about`, `destinations`, `gallery`, `contact`), the sticky Bootstrap navbar, Flexbox / CSS Grid layouts,
media queries (992px and 576px), and the existing colours and fonts. The new features were added **inside** these pages.

## New endterm features

| Page | New features |
|------|--------------|
| **All pages** | Dark/light **theme switcher** (saved in localStorage), **favorites counter** in the navbar, **back-to-top** button (jQuery), toast messages |
| **Home** | "Featured tours" cards generated from the `destinations` array |
| **About** | **FAQ accordion** (jQuery `slideToggle` / `slideUp`) |
| **Destinations** | Cards + price table generated from the array; **search**, **type** and **difficulty** filters, **max-price slider**, **sorting**, **favorites list** with total price, "Details" toggle (jQuery) |
| **Gallery** | Photos generated from the `galleryItems` array, **category filter**, **lightbox** with keyboard control |
| **Contact** | Booking form with **custom validation**, live **price estimate**, message counter, success message |

## How to test the interactive functions

1. **Theme** – click *Dark mode* in the navbar; reload the page: the theme is remembered.
2. **Search / filters** (Destinations) – type `lake` in Search (2 tours remain); choose Type = *Mountains*, Difficulty = *Hard*;
   move the price slider; change *Sort by*. Type `zzz` to see the "no results" message; press *Reset filters*.
3. **Favorites** – press the heart on any card (a toast appears, the navbar counter and *My favorites* list update, total price is calculated).
   Press *Remove* in the list or the heart again to remove. Reload: favorites are kept.
4. **Details** (Home / Destinations) – press *Details* on a card: the block slides open (jQuery), the button text changes to *Hide*.
5. **FAQ** (About) – click a question: its answer slides down and the previously open answer slides up.
6. **Gallery** – use the category buttons; click a photo to open the lightbox; use `←` / `→` keys or the arrows, `Esc` or `×` or a click on the dark area to close.
7. **Booking form** (Contact)
   - Press *Send request* with an empty form: every required field shows its own message and focus goes to the first error.
   - Try: name `A1`, email `bad@`, phone `123`, travellers `9`, message `short`, a past date, or a date outside April–October.
     Errors disappear as soon as the field becomes valid.
   - Choose a tour and travellers: the **estimated price** updates (10% discount from 4 travellers).
   - Fill everything correctly and tick the checkbox: a green success message appears and the form resets.
   - The *Book* button on a tour card opens this form with the tour already selected.
8. **Back to top** – scroll down on any page: the round button fades in; click it to scroll up smoothly.

## Where each requirement is in the code

| Requirement | Location |
|-------------|----------|
| Arrays (≥2) | `js/data.js` (`destinations`, `galleryItems`); `favorites` in `js/main.js`; `visibleItems` in `js/gallery.js` |
| Loops (≥2) | `for...of` in `createDestinationCard`, `getUniqueValues`, `calculateFavoritesTotal`; `forEach` in `renderCards`, `renderGallery`, `validateForm` |
| Functions (≥4, with parameters and return values) | `filterDestinations`, `sortDestinations`, `formatPrice`, `findDestination`, `calculateTripPrice`, `getDiscountRate`, `isValidEmail`, `filterGallery`, `wrapIndex`, `loadFromStorage` … |
| DOM: create / remove elements | favorites `<li>` items (`renderFavorites`), lightbox (`openLightbox` / `closeLightbox`), toast, validation messages |
| DOM: change text / class / attribute / visibility | heart buttons (`updateFavoriteButtons`), `d-none` toggles, `aria-*` attributes, `data-bs-theme` |
| Events (`addEventListener`) | `click`, `input`, `change`, `submit`, `keydown`, `blur`, `DOMContentLoaded`; event object used (`event.target`, `event.key`); `preventDefault()` in the form submit |
| Form validation | `js/contact.js` – `validators` object, `validateField`, `validateForm`, `showSuccess` |
| jQuery | `js/effects.js` – selectors: ID, class, element/descendant, attribute; traversal: `closest`, `find`, `next`, `parent`, `siblings`; events: `click`, `scroll`; effects: `slideToggle`, `slideUp`, `fadeIn`, `fadeOut`, `animate` |

## Project structure

```
index.html  about.html  destinations.html  gallery.html  contact.html
css/style.css
js/theme-init.js    applies the saved theme before the page is painted
js/data.js          arrays with tours and photos
js/main.js          shared code: favorites, theme, tour cards, storage helpers
js/destinations.js  Destinations page
js/gallery.js       Gallery page
js/contact.js       Contact page (validation)
js/effects.js       jQuery features
images/
```

Libraries: Bootstrap 5.3.3 and jQuery 3.7.1 (both from CDN).

## Notes

- The booking form has no server: after successful validation it only shows a success message (no data is sent).
- `images/tien-shan-web.jpg` is a 1600px copy of `tien-shan.jpg` (17 MB) used by the site so pages load fast.
- Three tours (Lake Kaindy, Tien Shan Trek, Steppe Sunset & Stargazing) were added to the midterm's three tours to make filtering meaningful; their prices are examples and can be changed in `js/data.js`.
