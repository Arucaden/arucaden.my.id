<script lang="ts">
  import { experiences } from '@data/experiences.ts';
  import ExperienceBadge from './ExperienceBadge.svelte';
  const latestExperiences = experiences.slice(0, 4);
</script>

<section aria-labelledby="experience-heading" class="flex flex-col flex-1 min-h-0">
  <div class="flex justify-between items-center mb-1">
    <h2 id="experience-heading" class="section-title m-0">.Experiences</h2>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
    {#each latestExperiences as exp, i}
      <article
        class={`flex flex-col gap-1 border-2 rounded-xl bg-black/50 p-3 transition-all hover:hov-fx
          ${i === 0 
            ? 'text-white border-main' 
            : 'text-white-text border-tertiary hover:border-main hover:text-white'}
        `}
      >
        <div class="flex justify-between items-start gap-2">
          <span class="font-bold text-sm">{exp.company}</span>
          <span class="text-xs whitespace-nowrap mt-0.5 text-gray-text">{exp.period}</span>
        </div>
        
        <span class="text-xs text-gray-text">{exp.role}</span>
        
        <div class="mt-1 flex flex-wrap gap-1.5">
          <ExperienceBadge text={exp.type} />
          <ExperienceBadge text={exp.location} />
        </div>
      </article>
    {/each}
  </div>

  <button id="show-all-experiences" type="button" class="button-fx w-full mt-3">
    Show All Experiences
  </button>
</section>
