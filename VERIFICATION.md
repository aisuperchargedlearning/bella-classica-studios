# First-version verification

- `npm run build` passed: strict TypeScript checking and a Vite production build.
- Both supplied ImageKit MP3 URLs returned HTTP 200 with `audio/mpeg`, CORS support, and byte-range support.
- The in-app browser loaded real recording metadata, initially approximately 17:49 for narration and 2:58 for the song. The narration duration estimate changes slightly as the browser decodes more of the MP3; the player displays the browser's actual current duration rather than a hard-coded value.
- Playback buttons changed to their pause states; starting the song paused narration and retained its position.
- Keyboard seeking to the end and back to the start, narration speed selection, and mute were exercised in the browser.
- Document width matched viewport width at 320, 390, 768, 1024, and 1440 pixels. The desktop and phone layouts were visually inspected.
- An isolated local fixture with a lead image and two gallery images verified the populated gallery and enlarged image dialog. Escape closed the dialog and restored focus to the image button. Fixture images are not included in the production chapter content.
- The isolated fixture also verified failed audio: each recording displayed a readable alert and a direct source link. The main preview had no captured browser error or warning logs.
- Reduced-motion support is implemented through CSS. No operating-system preference was changed during verification.

A passing local build is not a completed Amplify deployment. Deployment must be verified in the connected Amplify app after the deployment branch is updated.
