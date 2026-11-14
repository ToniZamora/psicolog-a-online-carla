<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared visual roles and typography in src/styles.css and load fonts in the root route head so all pages stay visually consistent.
- Keep intervention-area content in the home page's data array so repeated area entries use the same presentation.
- Public content pages share navigation and footer through the root shell; booking and private pages retain their own layouts to avoid changing appointment flows.
- Keep editable contact-page details separate from active contact links; unfilled details must display an explicit pending state rather than invented contact information.
- Render geographic context with Google Maps Embed and independent locality search links; never present locality coordinates as exact consultation addresses.
- Keep remote consultation entries separate from geographic map locations so online services never become map targets.
