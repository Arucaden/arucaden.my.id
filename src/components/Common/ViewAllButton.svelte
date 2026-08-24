<script lang="ts">
  let {
    text = 'View All',
    icon = 'i-ri-arrow-right-line',
    onclick = () => {},
    href = undefined,
    id = undefined,
  }: {
    text: string;
    icon?: string;
    onclick?: () => void;
    href?: string;
    id?: string;
  } = $props();
</script>

{#if href}
  <a {id} {href} class="btn-view-all group">
    <span>{text}</span>
    <span class={`${icon} w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-main`}></span>
  </a>
{:else}
  <button {id} type="button" {onclick} class="btn-view-all group">
    <span>{text}</span>
    <span class={`${icon} w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-main`}></span>
  </button>
{/if}
