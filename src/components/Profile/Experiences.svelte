<script lang="ts">
  import { experiences } from '@data/experiences.ts';
  const latest = experiences[0];
</script>

<section aria-labelledby="experience-heading" class="flex flex-col flex-1 min-h-0">
  <h2 id="experience-heading" class="section-title">.Experiences</h2>

  {#if latest}
    <article class="border-2 border-secondary/30 bg-black/30 rounded-lg p-2">

      <div class="flex items-center gap-2 min-w-0">
        <p class="prose-text font-semibold leading-tight truncate">{latest.company}</p>
        <span class="text-[11px] px-2 py-0.5 rounded-full bg-main/15 text-main border border-main/40 shrink-0">{latest.type}</span>
        <span class="text-[11px] px-2 py-0.5 rounded-full border border-secondary/40 text-gray-200 shrink-0">{latest.location}</span>
        <span class="ml-auto text-xs text-gray-400 whitespace-nowrap">{latest.period}</span>
      </div>

      {#if latest.role}
        <p class="text-xs text-gray-300 mt-0.5">{latest.role}</p>
      {/if}

      {#if latest.points?.length}
        <ul class="mt-2 list-disc list-inside space-y-1">
          {#each latest.points as pt}
            <li class="text-sm text-white/90 leading-snug">{pt}</li>
          {/each}
        </ul>
      {/if}
    </article>
  {/if}

  <button id="show-all-experiences" type="button" class="button-fx w-full mt-3">
    Show All Experiences
  </button>
</section>
