# Advaith — interactive portfolio: strategy and prototype review

Status: prototype for review. Nothing beyond the intro scene is built. Every piece of copy is a placeholder (see `src/data/content.ts`).

## 0. Verdict

The idea works, and it works *because* of the constraint you set: one blank blue figure whose personality comes only from pose, movement and props. That constraint is also what makes the technical choice easy.

**Recommendation: build the character as a procedural SVG rig, animated by GSAP + ScrollTrigger. Do not use Rive, Lottie or Vectorizer.AI.** Reasoning is in section 3. In short: he is one circle and five polylines, so a "skeleton" of about 20 numbers is a complete animation system, and it is the only approach where I can write, tune and revise the animation directly in this same workflow.

Three things I would push on:

1. **Budget the transformations.** Normal → Hulk → coder → calm is four "personalities". Keep it restrained by giving each a *single* clear beat, with static poses in between, and capping pinned scroll at roughly 2 screens per scene (about 8 to 9 screens in total).
2. **Keep the Hulk blue.** You asked for one consistent character. Bigger, wider, heavier limbs and a flexing pose already read as "Hulk". Turning him green would break "personality from movement, not visual detail".
3. **Projects must stay real HTML.** The character stages around the project cards; he never replaces them. A recruiter who ignores the scene should still get the whole story from the cards, and mobile / reduced-motion users get exactly that.

## 1. Visual and design system

Tokens live in `src/index.css` (`@theme`) and are shown live in the lab (`/#lab`).

| Token | Value | Role |
|---|---|---|
| paper | `#f8fafd` | Page. A cool, bright white (deliberately not cream) |
| surface | `#ffffff` | Raised frames: photo, project media, bubble |
| ink | `#13203a` | Headings. A deep navy that sits with the blue |
| ink-soft | `#4a5875` | Body copy |
| ink-mute | `#5e6a86` | Meta and captions (4.5:1 or better on paper) |
| line | `#e3e8f2` | Hairlines |
| blue | `#2b59ff` | The character, the primary button, links. The only accent |
| blue-soft | `#a9bcff` | The character's thin outline |
| blue-tint | `#edf1ff` | Quiet fills |

- **Type:** Instrument Sans only. Display 96 semibold at -0.035em tracking; section heading 48; project title 30; body 20/1.6 kept under about 65 characters per line; captions 16. Hierarchy comes from size, weight and space, not from a second typeface or all-caps labels.
- **Surfaces:** hairline borders, no shadows, no gradients, no blur. Radii: 28 on the portrait, 22 on project frames, full on buttons and tags.
- **Motion rule:** nothing moves unless the story changes. No loops, no idle breathing, no hover choreography.

Plan review, what I changed and why: my first instinct was a serif headline with small numbered labels ("01 / About"). Those are generic and the content is not a sequence, so I removed them. The section heading arrives as plain sentence-case type. Colour stays at one accent because the character is the personality; everything else is quiet.

## 2. Page architecture

```
SiteHeader (fixed)         wordmark + Work / Contact
main
 ├─ Scene 1  Intro → About       pinned, ~2.4 screens   [built: prototype]
 │            wide landscape opening; he points at the photo; layout breaks apart;
 │            he drags the intro text across; blocks settle into the About layout
 ├─ Scene 2  Strength            pinned, ~2 screens     [planned]
 │            flex → crouch → jump; while he falls the About layout rearranges into the
 │            Projects header; landing is the section change
 ├─ Scene 3  Projects            pinned "workbench"     [planned]
 │            coder pose (glasses, laptop) seated on the top edge of the project frame;
 │            each project is one scroll step; his laptop taps swap the project shown
 └─ Scene 4  Contact             normal flow, static    [prototype stub]
              calm; he leans on the real "Get in touch" mailto button
```

Code layout:

```
src/
  data/content.ts          all copy, projects, links (single source of truth)
  character/
    rig.ts                 pose model, FK + 2-bone IK, walk cycle, SVG renderer (no React)
    poses.ts               pose library as plain data
    Stickman.tsx           <StickmanLayer> (inside a scene SVG) and <StickmanFigure> (standalone)
  motion/                  gsap setup, stage scaling, "full experience?" media query
  components/              Section, ProjectCard, Photo, SpeechBubble, ButtonLink, SiteHeader
  scenes/<scene>/
    frames.ts              layout frames in stage units (edit numbers to re-layout)
    blocks.tsx             presentational content blocks (shared with the static fallback)
    timeline.ts            the choreography as one GSAP timeline (no React inside)
    <Scene>Stage.tsx       pinned stage markup + wiring
    <Scene>Static.tsx      mobile / reduced-motion version
  lab/Lab.tsx              design system + live pose tester
```

A scene is *frames + blocks + timeline*. Replacing or reordering a scene never touches another one.

**Stage model.** Pinned scenes are authored on a fixed 1280×720 canvas that is scaled to fit the viewport. Everything (blocks, character, hand targets) shares one coordinate system, so "his hand is on the edge of that block" is exact at any window size. Normal sections (projects list fallback, contact) use ordinary fluid layout. Trade-off: text in pinned scenes scales with the viewport, so the full experience is desktop-only (viewport at least 1024 wide).

## 3. Character implementation strategy

### What he is

One head circle, one torso line, two two-segment arms, two two-segment legs, drawn as SVG paths with round caps. In `rig.ts`:

- A **Pose** is about 20 numbers: limb angles, lean, head tilt, scale, weight (limb thickness), shoulder span, optional hand-reach targets, walk phase, prop visibility.
- `rig.render()` turns a pose into the SVG path data. GSAP tweens the numbers; there is no per-part DOM animation.
- **Two-pass drawing** (all light outlines first, then all solid blue) gives a clean thin outline around the silhouette only, never between overlapping limbs. This is hard to do with independent nested groups and is one reason I use a procedural rig instead of "independently controllable parts".
- **Grounding**: set `ground` and `plant`, and the pelvis height is derived so the feet always rest on the floor. He can grow to Hulk size or crouch without any y-value being hand-tuned, and walking gets a natural bob for free.
- **2-bone IK** on the arms: "put your hand *there*" for grabbing and pulling. Combined with `toWorld(hand)` the block is glued to his hand, so contact is exact by construction. In the simulated scroll timeline, grab and release positions match to within 0.01 stage px.
- **Walk cycle** is driven by distance travelled, so feet never skate and scrubbing backward walks backward.
- **Props** (glasses, laptop) are simple shapes attached to head and pelvis, faded in with a number.

Poses so far (`docs/poses.png`): idle, point, pull, hulk, hulkCrouch, hulkAir, hulkLand, coder, lean.

### Tool evaluation

Answers for each tool, in the five-point format you asked for.

**GSAP + ScrollTrigger (recommended, used)**
1. *Create:* the scene timelines, in code.
2. *Export:* nothing. It is an npm package (`gsap`); the character is code, not an asset.
3. *Integrate:* `npm i gsap`; `motion/gsap.ts` registers ScrollTrigger; each scene builds one timeline and attaches it with `scrollTrigger: { pin, scrub }`.
4. *Claude:* everything: rig, poses, timelines, layout frames.
5. *Yes.* Same repo, same editor, no export step. GSAP and ScrollTrigger are free to use, including commercially (check the current licence terms before shipping).

**Rive (not recommended)**
1. *Create:* a bone-rigged character with animations and a state machine in the Rive editor (a GUI).
2. *Export:* a binary `.riv` file.
3. *Integrate:* `@rive-app/react-canvas`, feed scroll progress into a state-machine input; it ships a WASM runtime, which is far heavier than this character needs (measure on Bundlephobia before deciding).
4. *Claude:* the React integration code and scroll wiring only. I cannot author or edit the `.riv`; every pose change means reopening the Rive editor yourself.
5. *No.* Animation edits leave this workflow.
Where Rive would genuinely win: mesh deformation, a designer hand-keying complex character acting, or rich click-driven state machines. None of these apply to a blank stick figure whose interactions must also touch HTML elements.

**Lottie (not recommended)**
1. *Create:* animation clips in After Effects (Bodymovin) or LottieFiles tools.
2. *Export:* a `.json` / `.lottie` file per clip.
3. *Integrate:* `lottie-web` or `@lottiefiles/dotlottie-react`, scrub frames from ScrollTrigger.
4. *Claude:* the wiring only. Editing the JSON by hand is impractical.
5. *No.* Also weak fit: each pose/prop combination becomes a baked clip, and he could not grab a live HTML block because there is no hand position to read.

**Vectorizer.AI (not needed)**
- It traces a raster image into filled SVG shapes. For this character that is the wrong output: you would get fused filled outlines rather than round-capped strokes, so thickness scaling (Hulk), the two-pass outline and per-limb pivots would all break, and an AI-generated stick figure will not have consistent proportions between images anyway.
- It *is* a reasonable fit for a hand-drawn logo mark, a signature, or a one-off static illustration (for example a social share image). If you want a hand-drawn look, the better route is to let me add a very slight per-vertex wobble to the rig's line drawing.
- 1 to 5 for the use case where it does help: you draw or generate a static image; export SVG; drop it in `public/` or inline it as a component; I can integrate but not run the tool; you re-run it for any redraw. Check its current pricing and licence before relying on it.

### How close to the Alan Becker language is this?

The *look* matches the brief: blank round head, thick round-capped stick limbs, solid blue, thin light outline, no detail. The *feel* of that style comes from timing: anticipation, overshoot, follow-through, brief impact holds. The rig makes those cheap (a pose is an object), but they have to be authored beat by beat. The prototype has the hop-turn and lean-into-the-pull; the Hulk jump is where most of that polish will go.

## 4. Animation strategy

- **Scroll-scrubbed inside pinned scenes, nothing else.** No idle loops, no entrance animations on every section, no smooth-scroll hijacking.
- **One timeline per scene**, positions in units, reading top to bottom like a script. The intro timeline (`scenes/intro/timeline.ts`) is about 60 lines.
- **Layout moves are translate/scale only.** Blocks never reflow mid-motion. Text stays crisp and the work is cheap: per frame, one SVG rewrite (about 12 attributes) and a handful of transforms.
- **Story-driven motion.** Things move because he moves them (the text block is physically dragged; the focus items only rearrange once it has cleared their column) or because the section is changing.
- **Collision discipline.** The storyboard (`docs/scene-storyboard.png`) is generated from the real timeline; nothing passes through anything else.
- **Caps.** Around 2 screens of pinned scroll per scene; a skip link and normal nav anchors always work.

The intro in beats: rest and greet → arm lowers, photo travels and shrinks → hop-turn, walk to text → reach and grab → hop-turn, pull across the stage → let go, focus items stack, heading arrives.

## 5. Accessibility and performance

- The character SVG and speech bubble are decorative (`aria-hidden`); all real content is normal DOM in reading order.
- Full pinned experience only when the viewport is at least 1024×600 **and** `prefers-reduced-motion` is not set. Otherwise the static version renders the same content with the character in a still pose.
- Visible focus ring, skip link, colour contrast at or above AA for text.
- Production build: about 122 KB gzip total JS (React, GSAP, ScrollTrigger and the app). No images or video loaded up front.
- Real project media should be lazy-loaded and sized; the full-height pinned stage never depends on it.

## 6. What I verified, and what I could not

- Verified by simulation in Node: the rig maths, every pose, the scroll timeline end to end (contact, continuity at grab and release, no overlapping blocks), TypeScript strictness, production build.
- **Not verified:** I had no browser in my environment, so I have not seen it running in a real one. Typography rendering, the exact feel of the scrub, and the mobile static layout are unchecked. Treat the first browser run as part of the review and tell me what looks off.

## 7. Open questions for you

1. Your photo, full name, role line, location, real intro text and email.
2. The 2 to 4 projects that should get the workbench treatment, with one-line results for each.
3. Agree that the Hulk stays blue?
4. Should the coder scene show each project on his laptop (small), or should he sit on top of a large project frame (my recommendation)?
5. Happy with about 8 to 9 screens of total pinned scroll, or should it be shorter?

## 8. Running it

```
npm install
npm run dev        # http://localhost:5173  (the lab is at /#lab)
npm run build
```
