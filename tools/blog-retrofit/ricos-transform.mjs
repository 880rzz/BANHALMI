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

/** Prefer imageData.caption; fall back to CAPTION child TEXT (authoritative Ricos shape). */
export function imageCaptionText(imageNode) {
  if (!imageNode || imageNode.type !== 'IMAGE') return '';
  const field = imageNode.imageData && imageNode.imageData.caption;
  if (field && String(field).trim()) return String(field).trim();
  const captionChild = (imageNode.nodes || []).find((n) => n.type === 'CAPTION');
  if (!captionChild) return '';
  return (captionChild.nodes || [])
    .filter((c) => c.type === 'TEXT')
    .map((t) => (t.textData && t.textData.text) || '')
    .join('')
    .trim();
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

const BOLD_DECORATION = { type: 'BOLD', fontWeightValue: 700 };
const ITALIC_DECORATION = { type: 'ITALIC', italicData: true };

/**
 * @param {object[]} decorations
 * @param {{ upgradeIncomplete?: boolean }} [opts]
 *  - Missing BOLD/ITALIC always added with complete Ricos payload.
 *  - Existing type-only decorations left as-is unless upgradeIncomplete (avoids
 *    churn on live reference posts that already render with `{type:"BOLD"}`).
 */
function normalizeH2Decorations(decorations, opts = {}) {
  const upgradeIncomplete = !!opts.upgradeIncomplete;
  const next = [];
  let hasBold = false;
  let hasItalic = false;
  let changed = false;

  for (const d of decorations || []) {
    if (d.type === 'BOLD') {
      hasBold = true;
      if (upgradeIncomplete && d.fontWeightValue !== 700) {
        next.push({ ...BOLD_DECORATION });
        changed = true;
      } else {
        next.push(d);
      }
      continue;
    }
    if (d.type === 'ITALIC') {
      hasItalic = true;
      if (upgradeIncomplete && d.italicData !== true) {
        next.push({ ...ITALIC_DECORATION });
        changed = true;
      } else {
        next.push(d);
      }
      continue;
    }
    next.push(d);
  }

  if (!hasBold) {
    next.push({ ...BOLD_DECORATION });
    changed = true;
  }
  if (!hasItalic) {
    next.push({ ...ITALIC_DECORATION });
    changed = true;
  }

  return { decorations: next, changed };
}

function ensureH2BoldItalic(headingNode, opts = {}) {
  let headingChanged = false;
  const nextNodes = (headingNode.nodes || []).map((child) => {
    if (child.type !== 'TEXT' || !child.textData) return child;
    const { decorations, changed } = normalizeH2Decorations(
      child.textData.decorations || [],
      opts
    );
    if (!changed) return child;
    headingChanged = true;
    return {
      ...child,
      textData: { ...child.textData, decorations },
    };
  });
  return {
    node: headingChanged ? { ...headingNode, nodes: nextNodes } : headingNode,
    changed: headingChanged,
  };
}

/**
 * Apply structural editorial rhythm.
 * @param {object[]} nodes
 * @param {{ upgradeIncompleteH2Decorations?: boolean }} [opts]
 * @returns {{ nodes, changes: string[], warnings: string[], reviewRequired: string[] }}
 */
export function transformRichContentNodes(nodes, opts = {}) {
  const changes = [];
  const warnings = [];
  const reviewRequired = [];
  let working = Array.isArray(nodes) ? nodes.map((n) => n) : [];
  const h2Opts = {
    upgradeIncomplete: !!opts.upgradeIncompleteH2Decorations,
  };

  // Opening IMAGE with caption = content lead, not decorative hero.
  const openingImage =
    working[0]?.type === 'IMAGE'
      ? working[0]
      : isEmptyParagraph(working[0]) && working[1]?.type === 'IMAGE'
        ? working[1]
        : null;
  if (openingImage) {
    if (imageCaptionText(openingImage)) {
      warnings.push('CONTENT_LEAD_IMAGE_OK');
    } else {
      reviewRequired.push('HERO_IMAGE_REVIEW');
    }
  }

  // 1) H2 BOLD+ITALIC (complete Ricos decoration shape when adding)
  working = working.map((n) => {
    if (n.type === 'HEADING' && n.headingData && n.headingData.level === 2) {
      const { node, changed } = ensureH2BoldItalic(n, h2Opts);
      if (changed && !changes.includes('H2_FORMAT')) changes.push('H2_FORMAT');
      return node;
    }
    if (n.type === 'HEADING' && n.headingData && n.headingData.level === 1) {
      reviewRequired.push('H1_IN_RICH_CONTENT');
    }
    return n;
  });

  // 2) IMAGE spacing: at most one empty before (non-opening) and after
  {
    const out = [];
    for (let i = 0; i < working.length; i++) {
      const n = working[i];
      if (n.type === 'IMAGE') {
        while (
          out.length >= 2 &&
          isEmptyParagraph(out[out.length - 1]) &&
          isEmptyParagraph(out[out.length - 2])
        ) {
          out.pop();
          if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        }

        const prev = out[out.length - 1];
        // Insert missing empty BEFORE image when not document-start and prev is content
        if (out.length > 0 && prev && !isEmptyParagraph(prev) && prev.type !== 'IMAGE') {
          out.push(emptyParagraph());
          if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        }

        out.push(n);

        const next = working[i + 1];
        if (next && !isEmptyParagraph(next) && next.type !== 'IMAGE') {
          out.push(emptyParagraph());
          if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        }
        continue;
      }

      if (isEmptyParagraph(n) && out.length && isEmptyParagraph(out[out.length - 1])) {
        if (!changes.includes('IMAGE_SPACING')) changes.push('IMAGE_SPACING');
        continue;
      }
      out.push(n);
    }

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

  // 3) H2 paragraph rhythm: one empty before and after H2
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

      out.push(n);
    }

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

/**
 * Fail closed on missing post-update firstPublishedDate when pre-update had one.
 * @returns {{ regressions: string[], unknowns: string[] }}
 */
export function comparePreservation(before, after) {
  const fields = [
    'translationId',
    'language',
    'slug',
    'urlPath',
    'memberId',
  ];
  const regressions = [];
  const unknowns = [];

  for (const f of fields) {
    if (before[f] !== after[f]) regressions.push(f);
  }

  if (before.firstPublishedDate) {
    if (!after.firstPublishedDate) {
      // Fail closed: missing post-update value is UNKNOWN, not a silent pass.
      unknowns.push('firstPublishedDate');
    } else {
      // Draft API may truncate ms (…53.178Z vs …53Z); compare second precision.
      const beforeSec = Math.floor(Date.parse(before.firstPublishedDate) / 1000);
      const afterSec = Math.floor(Date.parse(after.firstPublishedDate) / 1000);
      if (Number.isNaN(beforeSec) || Number.isNaN(afterSec)) {
        unknowns.push('firstPublishedDate');
      } else if (beforeSec !== afterSec) {
        regressions.push('firstPublishedDate');
      }
    }
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

  return { regressions, unknowns };
}

/** Gate passes only when regressions and unknowns are both empty. */
export function preservationOk(result) {
  return (
    result &&
    Array.isArray(result.regressions) &&
    Array.isArray(result.unknowns) &&
    result.regressions.length === 0 &&
    result.unknowns.length === 0
  );
}
