/**
 * Idempotent Ricos richContent transforms for BANHALMI blog editorial retrofit.
 * Structural only: IMAGE spacing, H2 BOLD+ITALIC, H2 surrounding empties, double-empty collapse.
 * Does not invent facts, change media IDs, link URLs, or delete content images.
 */

export function emptyParagraph() {
  return { type: 'PARAGRAPH', id: '', nodes: [], paragraphData: {} };
}

export function isEmptyParagraph(node) {
  if (!node || node.type !== 'PARAGRAPH') return false;
  const children = node.nodes || [];
  if (children.length === 0) return true;
  return children.every((c) => {
    if (c.type !== 'TEXT') return false;
    const text = (c.textData && c.textData.text) || '';
    return text.trim() === '';
  });
}

export function collectImageIds(nodes, out = []) {
  for (const n of nodes || []) {
    if (n.type === 'IMAGE') {
      const id =
        n.imageData &&
        n.imageData.image &&
        n.imageData.image.src &&
        n.imageData.image.src.id;
      if (id) out.push(id);
    }
    if (n.nodes) collectImageIds(n.nodes, out);
  }
  return out;
}

export function collectLinkTargets(nodes, out = []) {
  for (const n of nodes || []) {
    if (n.type === 'TEXT' && n.textData && n.textData.decorations) {
      for (const d of n.textData.decorations) {
        if (d.type === 'LINK' && d.linkData && d.linkData.link) {
          const link = d.linkData.link;
          out.push(link.url || link.anchor || JSON.stringify(link));
        }
      }
    }
    if (n.nodes) collectLinkTargets(n.nodes, out);
  }
  return out;
}

function ensureH2BoldItalic(headingNode) {
  let changed = false;
  const nextNodes = (headingNode.nodes || []).map((child) => {
    if (child.type !== 'TEXT' || !child.textData) return child;
    const decorations = [...(child.textData.decorations || [])];
    const types = new Set(decorations.map((d) => d.type));
    if (!types.has('BOLD')) {
      decorations.push({ type: 'BOLD' });
      changed = true;
    }
    if (!types.has('ITALIC')) {
      decorations.push({ type: 'ITALIC' });
      changed = true;
    }
    if (!changed) return child;
    return {
      ...child,
      textData: { ...child.textData, decorations },
    };
  });
  return {
    node: changed ? { ...headingNode, nodes: nextNodes } : headingNode,
    changed,
  };
}

/**
 * Apply structural editorial rhythm.
 * @returns {{ nodes, changes: string[], warnings: string[], reviewRequired: string[] }}
 */
export function transformRichContentNodes(nodes) {
  const changes = [];
  const warnings = [];
  const reviewRequired = [];
  let working = Array.isArray(nodes) ? nodes.map((n) => n) : [];

  // Opening IMAGE with caption = content lead (Fotótörténelem subject image), not decorative hero.
  if (working[0]?.type === 'IMAGE') {
    const cap = working[0].imageData && working[0].imageData.caption;
    if (cap && String(cap).trim()) {
      warnings.push('CONTENT_LEAD_IMAGE_OK');
    } else {
      reviewRequired.push('HERO_IMAGE_REVIEW');
    }
  } else if (isEmptyParagraph(working[0]) && working[1]?.type === 'IMAGE') {
    const cap = working[1].imageData && working[1].imageData.caption;
    if (!(cap && String(cap).trim())) {
      reviewRequired.push('HERO_IMAGE_REVIEW');
    } else {
      warnings.push('CONTENT_LEAD_IMAGE_OK');
    }
  }

  // 1) H2 BOLD+ITALIC
  working = working.map((n) => {
    if (n.type === 'HEADING' && n.headingData && n.headingData.level === 2) {
      const { node, changed } = ensureH2BoldItalic(n);
      if (changed && !changes.includes('H2_FORMAT')) changes.push('H2_FORMAT');
      return node;
    }
    if (n.type === 'HEADING' && n.headingData && n.headingData.level === 1) {
      reviewRequired.push('H1_IN_RICH_CONTENT');
    }
    return n;
  });

  // 2) IMAGE spacing: at most one empty before/after; add missing single empty after IMAGE when next is content
  {
    const out = [];
    for (let i = 0; i < working.length; i++) {
      const n = working[i];
      const prev = out[out.length - 1];
      if (n.type === 'IMAGE') {
        // collapse double empties before image
        while (
          out.length >= 2 &&
          isEmptyParagraph(out[out.length - 1]) &&
          isEmptyParagraph(out[out.length - 2])
        ) {
          out.pop();
          if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        }
        // optional: do not force empty BEFORE first image at document start
        out.push(n);
        const next = working[i + 1];
        if (next && !isEmptyParagraph(next) && next.type !== 'IMAGE') {
          out.push(emptyParagraph());
          if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        }
        continue;
      }
      // skip empty that would create double after we already inserted after IMAGE
      if (
        isEmptyParagraph(n) &&
        prev &&
        isEmptyParagraph(prev)
      ) {
        if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        continue; // collapse double empty
      }
      out.push(n);
    }
    // collapse any remaining double empties (extra after image)
    const collapsed = [];
    for (const n of out) {
      if (
        isEmptyParagraph(n) &&
        collapsed.length &&
        isEmptyParagraph(collapsed[collapsed.length - 1])
      ) {
        if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        continue;
      }
      collapsed.push(n);
    }
    working = collapsed;
  }

  // 3) H2 paragraph rhythm: one empty before and after H2 at semantic boundaries (idempotent)
  {
    const out = [];
    for (let i = 0; i < working.length; i++) {
      const n = working[i];
      const isH2 =
        n.type === 'HEADING' && n.headingData && n.headingData.level === 2;

      if (isH2) {
        const prev = out[out.length - 1];
        if (prev && !isEmptyParagraph(prev) && prev.type !== 'IMAGE') {
          out.push(emptyParagraph());
          if (!changes.includes('PARAGRAPH_RHYTHM')) changes.push('PARAGRAPH_RHYTHM');
        } else if (
          prev &&
          isEmptyParagraph(prev) &&
          out.length >= 2 &&
          isEmptyParagraph(out[out.length - 2])
        ) {
          out.pop();
          if (!changes.includes('PARAGRAPH_RHYTHM')) changes.push('PARAGRAPH_RHYTHM');
        }
        out.push(n);
        const next = working[i + 1];
        if (next && !isEmptyParagraph(next)) {
          out.push(emptyParagraph());
          if (!changes.includes('PARAGRAPH_RHYTHM')) changes.push('PARAGRAPH_RHYTHM');
        }
        continue;
      }

      // skip empty that was already ensured after H2 (idempotent re-run)
      if (
        isEmptyParagraph(n) &&
        out.length &&
        out[out.length - 1].type === 'HEADING' &&
        out[out.length - 1].headingData &&
        out[out.length - 1].headingData.level === 2
      ) {
        // keep single empty already placed; if this is a second empty from source, drop later via collapse
        out.push(n);
        continue;
      }

      out.push(n);
    }

    // If we inserted empty after H2 and source also had empty, collapse doubles
    const collapsed = [];
    for (const n of out) {
      if (
        isEmptyParagraph(n) &&
        collapsed.length &&
        isEmptyParagraph(collapsed[collapsed.length - 1])
      ) {
        continue;
      }
      collapsed.push(n);
    }
    working = collapsed;
  }

  return { nodes: working, changes, warnings, reviewRequired };
}

export function simpleHash(value) {
  const s = typeof value === 'string' ? value : JSON.stringify(value);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

export function preservationSnapshot(post) {
  // Draft posts expose seoSlug; live posts expose slug. Normalize for comparisons.
  const slug = post.slug || post.seoSlug || null;
  const urlPath = post.url && post.url.path ? post.url.path : null;
  return {
    translationId: post.translationId || null,
    language: post.language || null,
    categoryIds: [...(post.categoryIds || [])].sort(),
    slug,
    urlPath,
    firstPublishedDate: post.firstPublishedDate || null,
    memberId: post.memberId || null,
    imageIds: collectImageIds((post.richContent && post.richContent.nodes) || []).sort(),
    linkTargets: collectLinkTargets((post.richContent && post.richContent.nodes) || []).sort(),
  };
}

export function comparePreservation(before, after) {
  const fields = [
    'translationId',
    'language',
    'slug',
    'urlPath',
    'memberId',
  ];
  const regressions = [];
  for (const f of fields) {
    if (before[f] !== after[f]) regressions.push(f);
  }
  // firstPublishedDate: only flag when both sides present and differ (draft fieldsets may omit it)
  if (
    before.firstPublishedDate &&
    after.firstPublishedDate &&
    before.firstPublishedDate !== after.firstPublishedDate
  ) {
    regressions.push('firstPublishedDate');
  }
  if (JSON.stringify(before.categoryIds) !== JSON.stringify(after.categoryIds)) {
    regressions.push('categoryIds');
  }
  if (JSON.stringify(before.imageIds) !== JSON.stringify(after.imageIds)) {
    regressions.push('imageIds');
  }
  if (JSON.stringify(before.linkTargets) !== JSON.stringify(after.linkTargets)) {
    regressions.push('linkTargets');
  }
  return regressions;
}
