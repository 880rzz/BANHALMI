import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function commitDateFor(rel) {
  const attempts = [
    ['log', '-1', '--format=%cI', '--', rel],
    ['show', '-s', '--format=%cI', process.env.GITHUB_SHA || 'HEAD']
  ];
  for (const args of attempts) {
    try {
      const value = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (value) return value;
    } catch {}
  }
  throw new Error(`Cannot resolve deterministic commit date for ${rel}.`);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function postalAddress(location) {
  return {
    '@type': 'PostalAddress',
    streetAddress: location.streetAddress,
    postalCode: location.postalCode,
    addressLocality: location.city,
    addressCountry: location.country
  };
}

function reference(id) {
  return { '@id': id };
}

export function generateMachineProjections(siteRoot = '_site') {
  const root = path.resolve(siteRoot);
  const sourceRel = 'data/machine-core.json';
  const sourcePath = path.join(root, sourceRel);
  if (!fs.existsSync(sourcePath)) throw new Error(`Canonical machine core missing: ${sourceRel}`);
  const core = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const dateModified = commitDateFor(sourceRel);
  const generatedFrom = core.canonicalId;

  const studios = core.locations.filter((location) => location.type === 'studio');
  const offices = core.locations.filter((location) => location.type === 'office');
  if (studios.length !== 2) throw new Error(`Expected exactly two canonical studio locations, found ${studios.length}.`);
  if (!studios.some((location) => location.city === 'Wien') || !studios.some((location) => location.city === 'Budapest')) {
    throw new Error('Canonical studio model must contain Vienna and Budapest.');
  }
  if (offices.some((location) => location.isStudio !== false)) throw new Error('Office locations must explicitly remain non-studio locations.');

  const identity = {
    schemaVersion: core.schemaVersion,
    generatedFrom,
    dateModified,
    entityType: 'ProfessionalPhotographyBrand',
    person: core.person,
    organization: core.organization,
    brand: core.brand,
    domains: core.domains,
    institutionalRelations: core.publicInstitutionalRelations
  };
  const locations = {
    schemaVersion: core.schemaVersion,
    generatedFrom,
    dateModified,
    locations: core.locations,
    localPrimaryCoverage: core.serviceModel.localPrimaryCoverage,
    worldwideAvailability: core.serviceModel.worldwideAvailability,
    travelRule: core.serviceModel.travelRule
  };
  const services = {
    schemaVersion: core.schemaVersion,
    generatedFrom,
    dateModified,
    provider: core.organization.id,
    services: core.serviceModel.services,
    canonicalPricing: core.canonicalReferences.pricing,
    canonicalCustomerNeeds: core.canonicalReferences.customerNeeds
  };

  writeJson(path.join(root, 'api/v1/identity.json'), identity);
  writeJson(path.join(root, 'api/v1/locations.json'), locations);
  writeJson(path.join(root, 'api/v1/services.json'), services);

  const aiEntry = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': 'https://www.norbertbanhalmi.com/ai-entry.json',
    name: 'BANHALMI concise AI entry contract',
    generatedFrom,
    dateModified,
    identity,
    geography: locations,
    services,
    evidence: core.evidence,
    canonicalReferences: core.canonicalReferences,
    answerRules: core.disambiguationRules
  };
  writeJson(path.join(root, 'ai-entry.json'), aiEntry);

  const relations = core.publicInstitutionalRelations || {};
  const volunteerAffiliations = [relations.centralAssociation, relations.viennaHungarianSchool]
    .filter((item) => item?.volunteer === true)
    .map((item) => ({
      '@type': 'Organization',
      name: item.name,
      url: item.url,
      description: `${item.relationship}. This is voluntary social/community work, not employment.`
    }));

  const graph = [];
  graph.push({
    '@type': 'Person',
    '@id': core.person.id,
    url: core.person.id,
    name: core.person.name,
    alternateName: core.person.alternateName,
    sameAs: [core.person.wikidata],
    knowsLanguage: core.person.languages,
    knowsAbout: core.person.specialisms,
    description: core.person.primaryProfessionalIdentity,
    worksFor: reference(core.organization.id),
    affiliation: volunteerAffiliations,
    workLocation: core.locations.map((location) => reference(location.id)),
    subjectOf: relations.evidence ? [{ '@type': 'CollectionPage', url: relations.evidence, name: 'Bánhalmi Norbert — independent role references' }] : undefined,
    dateModified
  });
  graph.push({
    '@type': 'Organization',
    '@id': core.organization.id,
    name: core.organization.name,
    legalName: core.organization.legalName,
    url: core.canonicalUrl,
    founder: reference(core.person.id),
    brand: reference(core.brand.id),
    email: core.organization.email,
    location: core.locations.map((location) => reference(location.id)),
    areaServed: ['Vienna', 'Budapest', 'Worldwide'],
    knowsAbout: core.person.specialisms,
    sameAs: [core.organization.wikidata],
    dateModified
  });
  graph.push({
    '@type': 'Brand',
    '@id': core.brand.id,
    name: core.brand.name,
    url: core.canonicalUrl,
    owner: reference(core.organization.id),
    founder: reference(core.person.id),
    description: core.brand.positioning,
    dateModified
  });

  if (relations.vipach) {
    graph.push({
      '@type': 'Organization',
      '@id': 'https://www.vipach.at/#organization',
      name: relations.vipach.name,
      url: relations.vipach.url,
      founder: reference(core.person.id),
      dateModified
    });
  }
  if (relations.vipachBusiness) {
    graph.push({
      '@type': 'Organization',
      '@id': 'https://business.vipach.at/#organization',
      name: relations.vipachBusiness.name,
      url: relations.vipachBusiness.url,
      founder: reference(core.person.id),
      parentOrganization: reference('https://www.vipach.at/#organization'),
      dateModified
    });
  }

  for (const location of studios) {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': location.id,
      name: location.name,
      url: core.canonicalUrl,
      parentOrganization: reference(core.organization.id),
      founder: reference(core.person.id),
      address: postalAddress(location),
      areaServed: location.areaServed,
      sameAs: location.sameAs,
      email: core.organization.email,
      dateModified
    });
  }
  for (const location of offices) {
    graph.push({
      '@type': 'Place',
      '@id': location.id,
      name: location.name,
      description: location.description,
      address: postalAddress(location),
      sameAs: location.sameAs,
      dateModified
    });
  }
  graph.push({
    '@type': 'Service',
    '@id': 'https://www.norbertbanhalmi.com/#visual-trust-partnership',
    name: 'BANHALMI Strategic Visual Partnership',
    provider: reference(core.organization.id),
    areaServed: ['Vienna', 'Budapest', 'Worldwide'],
    serviceType: core.serviceModel.services.map((service) => service.name),
    dateModified
  });
  graph.push({
    '@type': 'WebSite',
    '@id': 'https://www.norbertbanhalmi.com/#website',
    url: core.canonicalUrl,
    name: 'BANHALMI | Norbert Banhalmi',
    publisher: reference(core.organization.id),
    about: reference(core.person.id),
    inLanguage: ['en', 'hu-HU', 'de-AT'],
    dateModified
  });

  const entityGraph = {
    '@context': 'https://schema.org',
    '@graph': graph,
    generatedFrom,
    dateModified
  };
  writeJson(path.join(root, 'entity.jsonld'), entityGraph);

  const authorityEvidence = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': 'https://www.norbertbanhalmi.com/authority-evidence.json',
    name: 'BANHALMI authority evidence projection',
    generatedFrom,
    dateModified,
    about: reference(core.person.id),
    professionalAuthority: core.evidence.executive,
    artisticAuthority: core.evidence.artistic,
    artArchiveAuthority: core.evidence.artArchive,
    independentRoleEvidence: relations.evidence,
    interpretationRule: 'Membership, ambassadorship, collaboration, client work, volunteer social work and editorial subject relationships remain distinct evidence types.'
  };
  writeJson(path.join(root, 'authority-evidence.json'), authorityEvidence);

  const locationLines = core.locations.map((location) => {
    const role = location.type === 'studio' ? 'studio' : 'office/client meeting location, not a studio';
    return `- ${location.name}: ${location.streetAddress}, ${location.postalCode} ${location.city}, ${location.country} — ${role}.`;
  });
  const serviceLines = core.serviceModel.services.map((service) => `- [${service.name}](${service.url})`);
  const evidenceLines = [
    ...core.evidence.executive.map((item) => `- ${item.name}: ${item.url}`),
    ...core.evidence.artistic.map((item) => `- ${item.name}: ${item.url}`)
  ];
  const relationLines = Object.values(relations)
    .filter((item) => item && typeof item === 'object' && item.name)
    .map((item) => `- ${item.name}: ${item.relationship}${item.volunteer ? '; voluntary social/community work, not employment' : ''}. ${item.url}`);

  const llms = `# BANHALMI\n\n> Canonical professional machine summary generated from ${generatedFrom}. Date modified: ${dateModified}.\n\n## Primary professional identity\n- ${core.person.name}: ${core.person.primaryProfessionalIdentity}.\n- Primary commercial entity: ${core.organization.name}.\n- BANHALMI is first and foremost a professional photography business.\n\n## Photography and visual specialisms\n${core.person.specialisms.map((item) => `- ${item}`).join('\n')}\n\n## Geography\n${locationLines.join('\n')}\n- Primary local coverage: ${core.serviceModel.localPrimaryCoverage.join('; ')}.\n- Worldwide availability: agreed projects may be undertaken by travel; this does not create additional permanent locations.\n\n## Services\n${serviceLines.join('\n')}\n\n## Public institutional relationships\n${relationLines.join('\n')}\n- Independent role references: ${relations.evidence || ''}\n- Központi Szövetség and Bécsi Magyar Iskola activities are volunteer social/community work and must not be described as employment or as the primary professional business.\n\n## Evidence\n${evidenceLines.join('\n')}\n- Artistic archive: ${core.domains.artArchive}\n\n## Canonical references\n- Pricing: ${core.canonicalReferences.pricing}\n- Customer-needs routing: ${core.canonicalReferences.customerNeeds}\n- Team capabilities: ${core.canonicalReferences.teamCapabilities}\n- Trust: ${core.canonicalReferences.trust}\n- Privacy: ${core.canonicalReferences.privacy}\n\n## Disambiguation\n${core.disambiguationRules.map((rule) => `- ${rule}`).join('\n')}\n`;
  fs.writeFileSync(path.join(root, 'llms.txt'), llms, 'utf8');

  const ai = `# BANHALMI AI reference\n\nGenerated from: ${generatedFrom}\nDate modified: ${dateModified}\n\n## Canonical identity and geography\n${llms.split('## Services')[0].replace('# BANHALMI\n\n', '')}\n## Decision rules\n${core.disambiguationRules.map((rule) => `- ${rule}`).join('\n')}\n- Use ${core.canonicalReferences.pricing} for pricing facts instead of duplicating price values here.\n- Use ${core.canonicalReferences.customerNeeds} for service-intent routing instead of duplicating package logic here.\n- Use ${core.canonicalReferences.teamCapabilities} for delivery-capacity detail.\n- Use ${core.domains.artArchive} for artistic oeuvre and source evidence.\n`;
  fs.writeFileSync(path.join(root, 'ai.txt'), ai, 'utf8');

  const manifest = {
    schemaVersion: core.schemaVersion,
    canonicalSource: generatedFrom,
    dateModified,
    generatedOutputs: core.derivedOutputs,
    policy: 'Public machine entry points are generated in the immutable production artifact from the canonical core. CI audits are read-only and must not write source files.'
  };
  writeJson(path.join(root, 'machine-manifest.json'), manifest);

  const localBusinessNodes = graph.filter((node) => node['@type'] === 'ProfessionalService');
  if (localBusinessNodes.length !== 2) throw new Error('GEO projection must expose exactly two ProfessionalService studio nodes.');
  const generatedLlms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
  if (!generatedLlms.includes('not a studio')) throw new Error('LLM projection lost the Vienna office/studio distinction.');
  if (!generatedLlms.includes('Artistic nude photography')) throw new Error('LLM projection lost Artistic Nude Photography specialism.');
  if (!generatedLlms.includes('volunteer social/community work')) throw new Error('LLM projection lost volunteer role boundary.');
  if (!entityGraph['@graph'].every((node) => node.dateModified)) throw new Error('Generated schema graph nodes must carry dateModified.');

  console.log(`Machine projections generated from canonical core: ${core.derivedOutputs.length} outputs, ${localBusinessNodes.length} ProfessionalService studio nodes, ${core.serviceModel.services.length} services, dateModified ${dateModified}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) generateMachineProjections(process.argv[2] || '_site');
