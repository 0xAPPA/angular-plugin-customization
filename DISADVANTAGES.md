# Disadvantages

**Approach 1: DI Plugin Registry**
- No hot-swapping (plugins bundled at build time)
- Host rebuild required for every plugin change
- All customers' plugins in single bundle (can't selective load)
- Can't deploy plugins independently
- Long CI/CD times if many plugins

**Approach 2: Module Federation**
- Complex infrastructure (webpack/esbuild config, CDN, manifests)
- Separate build pipeline per customer plugin
- Version coordination nightmare (@angular/core must match)
- Breaking changes in host break all plugins
- Debugging harder (distributed bundles)
- shared dependency conflicts (singleton violations)
- Requires DevOps expertise
- Plugin deployment coupled to Angular version lifecycle

**Approach 3: Web Components**
- No Angular service injection (no DI access)
- No type safety across host-plugin boundary
- Communication limited to attributes + CustomEvents (boilerplate)
- Can't use Angular features (pipes, directives, routing)
- Must serialize data through attributes (strings only)
- No compile-time interface checking
- Debugging events harder (bubbling through DOM)

**Approach 4: Config-Driven**
- Zero custom code allowed (only predefined options)
- Can't add new behaviors (just toggle existing ones)
- Limited to what you pre-built (columns, themes, flags)
- Not actually a plugin system (just configuration)
- Requires building all variations upfront
- Doesn't scale to arbitrary customization

**Approach 5: Dynamic Components**
- No hot-swapping (components pre-bundled)
- Lazy-loaded but still in host bundle
- Can't deploy plugins independently
- Host rebuild needed for new plugins
- Just code-splitting, not true runtime loading
