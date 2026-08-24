<script lang="ts">
  import { experiences } from '@data/experiences.ts';
  import ExperienceBadge from './ExperienceBadge.svelte';
  const latestExperiences = experiences.slice(0, 3);
</script>

<section aria-labelledby="experience-heading" class="flex flex-col flex-1 min-h-0">
  <div class="flex justify-between items-center mb-3">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-main"></span>
      <h3 id="experience-heading" class="text-xs font-mono font-bold tracking-wider text-white uppercase m-0">
        Career & Engineering Roles
      </h3>
    </div>
    <span class="text-[11px] font-mono text-gray-text">Latest 3 Highlights</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
    {#each latestExperiences as exp, i}
      <article
        class={`flex flex-col justify-between gap-3 rounded-2xl p-4 transition-all duration-300 ${
          i === 0
            ? 'bg-[rgba(255,59,105,0.08)] border border-main/40 shadow-[0_0_20px_rgba(255,59,105,0.15)]'
            : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
        }`}
      >
        <div>
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="font-bold text-sm text-white">{exp.company}</span>
            <span class="text-[10px] font-mono whitespace-nowrap text-gray-text">{exp.period}</span>
          </div>

          <span class="text-xs font-mono text-main font-medium">{exp.role}</span>

          <p class="text-xs text-gray-text mt-2 line-clamp-2 leading-relaxed">
            {exp.points[0]}
          </p>
        </div>

        <div class="mt-2 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
          <ExperienceBadge text={exp.type} />
          <ExperienceBadge text={exp.location} />
        </div>
      </article>
    {/each}
  </div>

  <button
    id="show-all-experiences"
    type="button"
    class="btn-secondary w-full mt-4 text-xs font-mono py-2.5"
  >
    View Full Experience History ({experiences.length} Positions) ➔
  </button>
</section>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

