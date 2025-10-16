<script lang="ts">
  import { experiences } from '@data/experiences.ts';
  const latest = experiences[0];
</script>

<section aria-labelledby="experience-heading" class="flex flex-col flex-1 min-h-0">
  <h2 id="experience-heading" class="section-title">.Experiences</h2>

  {#if latest}
    <article class="border-2 border-secondary/30 bg-black/30 rounded-lg p-3">
      <div class="flex items-center justify-between w-full">
        <p class="prose-text font-medium">{latest.company}</p>
        <p class="prose-text text-gray-300">{latest.period}</p>
      </div>
      <p class="text-sm text-gray-300 mt-1">{latest.type}</p>

      {#if latest.points?.length}
        <ul class="mt-2 list-disc list-inside">
          {#each latest.points as pt}
            <li class="text-sm text-white/90">{pt}</li>
          {/each}
        </ul>
      {/if}
    </article>
  {/if}

  <button id="show-all-experiences" type="button" class="button-fx w-full mt-3">
    Show All Experiences
  </button>
</section>
