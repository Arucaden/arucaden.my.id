<script lang="ts">
  import { experiences } from '@data/experiences.ts';
  const latest = experiences[0];
</script>

<section aria-labelledby="experience-heading" class="flex flex-col flex-1 min-h-0">
  <h2 id="experience-heading" class="section-title">.Experiences</h2>

  {#if latest}
    <article class="border-2 border-secondary/30 bg-black/30 rounded-lg p-2">

      <div class="flex min-w-0 gap-2 flex-col sm:flex-row sm:items-center">
        <div class="flex items-center gap-2 sm:contents">
          <span class="font-bold sm:order-1">{latest.company}</span>
          <span class="text-sm color-gray-text whitespace-nowrap ml-auto sm:order-3">{latest.period}</span>
        </div>
        <div class="mt-1 flex gap-2 sm:mt-0 sm:order-2">
          <span class="text-sm px-2 py-0.5 rounded-full bg-main/15 text-main border border-main/40">{latest.type}</span>
          <span class="text-sm px-2 py-0.5 rounded-full border border-secondary/40 color-gray-text">{latest.location}</span>
        </div>
      </div>

        <span class="text-sm color-gray-text mt-0.5">{latest.role}</span>

        <ul class="mt-2 list-disc list-inside space-y-1">
          {#each latest.points as pt}
            <li class="text-sm text-white/90 leading-snug">{pt}</li>
          {/each}
        </ul>
    </article>
  {/if}

  <button id="show-all-experiences" type="button" class="button-fx w-full mt-3">
    Show All Experiences
  </button>
</section>
