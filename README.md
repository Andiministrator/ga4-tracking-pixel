# GA4 Tracking Pixel

** An Client for the server-side Google Tag Manager**


## Table of Contents

- [What is it for? - General Information](#what-is-it-for----general-information)
- [How it works](#how-it-works)
- [Requirements](#requirements)
- [Usage](#usage)
- [Configuration Options](#configuration-options)
- [Testing](#testing)
- [Contact and more Information](#contact-and-more-information)
- [Changelog](#changelog)

---

## What is it for? - General Information

This custom server-side GTM client allows you to send a configurable Google Analytics 4 Event and return a tracking image (1×1 GIF by default, but customizable as PNG, JPEG, or GIF and with own image content).
It’s ideal for tracking non-JavaScript environments, such as:
- Newsletter opens
- Email campaign hits
- Ad impressions
- Server-triggered tracking
You can use one client for different tracking pixel with its integrated mapping feature.

## How It Works

1. Request is made to the sGTM container (e.g. /my-newsletter/nl-05-2025/gatp.gif).
2. The client checks if the id matches an allowed id entry (or the default id) and (if so) claims the request.
3. A GA4 event is sent to the mapping Google Analytics Stream with all defined parameters.
4. The client responds with an image file (e.g. gatp.gif or logo.png).

## Requirements

- A working Server-Side Google Tag Manager (sGTM) container
- At least one GA4 Property and its Measurement ID
- This template added, configured and published in the Clients section

---

## Usage

Once the client is configured and published, it will respond to specific HTTP requests (e.g. to /my-newsletter/nl-05-2025/gatp.gif) by:
- Looking up the id in your configured mapping table.
- Sending a GA4 event using the matching or default GA4 Measurement ID.
- Returning the (tracking) image.

**Example Use Case: Email Newsletter Tracking Pixel**
In an email newsletter template, include the following <img> tag:
```html
<img src="https://ssgtm.yourdomain.com/my-newsletter/nl-05-2025/gatp.gif" width="1" height="1" />
```

This will:
- Trigger the server-side GTM container and claim the Request
- Fire the configured GA4 event (e.g. "pixel_view") with a configured Parameter (e.g. "campaign") and its value "nl-05-2025"
- Return a transparent image to the email client

You can also:
- Map further GA4 event parameter using the image path
- Return a custom branded image (logo.png) instead of a transparent pixel

---

## Configuration Options ⚙

### Name of Image

The filename returned in the response (e.g. `gatp.gif`).  
You may use a static image (hosted on a website), or a custom dynamic image depending on the image type selected.

**Default:** `gatp.gif`

### Setup of IDs and GA4 Measurement IDs

Defines which incoming `id` values the client will accept and which GA4 Measurement ID to use for each.

| Column | Description                                                              |
|--------|--------------------------------------------------------------------------|
| `id`   | The allowed value in the request URL (e.g., `newsletter`, `ad_campaign`) |
| `ga4id`| The corresponding GA4 Measurement ID                                     |

_Notice: If you need only one GA4 Measurement ID, you don't need to configure ID / Measurement-ID entries - just use the Default GA4 Measurement ID._

A configured ID defines the first path entry of the image URL.
E.g. if you defined an ID named `newsletter` and the image name `gatp.gif` (and your Hostname for sGTM is `sgtm.example.com`), your Image URL is:
https://sgtm.example.com/**newsletter**/gatp.gif

**Default GA4 Measurement ID:**  
Used if no matching entry for `id` is found (or configured).

### Event Settings

#### Event Name

Name of the GA4 event to be sent (e.g. `pixel_view`, `email_open`).

#### (URL) Path/Attribute Mapping

Maps incoming URL path part to GA4 event parameters.
You can pass multiple values for attributes in the URL path, between the ID and the image name, e.g.:
https://yourdomain.com/id-placeholder/<strong>attribute-1-value</strong>/<strong>attribute-2-value</strong>/image.gif
In this order, you can specify the names the attributes should have for transfer to Google Analytics.
If no name is specified for an attribute (but it exists in the URL), it is passed with the attribute name `attribute1` (for the first attribute).

Examples:
- newsletter_name
- newsletter_number

#### Event Attributes

Static key-value pairs that are always included with the GA4 event in the way as you configured here.

Examples:
| Name        | Value     |
|-------------|-----------|
| `channel`   | email     |
| `medium`    | pixel     |

#### Hostname

The hostname which will be tracked by GA4 (e.g. `newsletter.example.com`).

---

### Image Options

These settings control how the tracking pixel or custom image is returned:

#### Image Format

The image format (GIF, PNG or JPEG).
_Attention: Keep care, that the image name (at the beginning of the configuration options) matches the format._

#### Image Content as Base64

With this option you can send an individual image.
Therefore you need to transfer an image to its Base64 source content (e.g. using [base64-image.de](https://www.base64-image.de)).
Paste the Base64 sourcecode in this field.

---

## Testing

1. Activate Preview Mode in sGTM.
2. Trigger the request via your browser or an image in an email.
3. Verify:
   - The client was invoked
   - A GA4 request was sent
   - An image was returned in the response
4. Optionally confirm the event in GA4 DebugView.

---

## Contact and more Information

Feel free to use or change the code. If you have suggestions for improvement, please write to me.

- **Licence:** Apache 2.0
- **Repository:** [GA4 Event Importer - Github Repository](https://github.com/Andiministrator/ga4-tracking-pixel)

### Author and Contact

Please contact me if you found problems or have improvements:

**Andi Petzoldt**

- ☛ https://andiministrator.de
- ✉ andi@petzoldt.net
- 🧳 https://www.linkedin.com/in/andiministrator/
- 🐘 https://mastodon.social/@andiministrator
- 👥 https://friendica.opensocial.space/profile/andiministrator
- 📷 https://pixelfed.de/Andiministrator
- 🎧 https://open.audio/@Andiministrator/

---

## Changelog

- Version 1.0, *01.06.2025*
  - Initial Version

---
