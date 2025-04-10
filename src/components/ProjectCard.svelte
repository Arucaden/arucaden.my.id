<script>
    let hovered = $state(false);

    let {title, description = undefined, image, tech = [], url = undefined} = $props();
</script>
  
<div 
  class="relative border border-solid border-[#a73344] rounded-2 overflow-hidden transition duration-300 ease"
  role="button"
  tabindex="0"
  onmouseover={() => (hovered = true)} 
  onfocus={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onblur={() => (hovered = false)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (url) window.location.href = url;
    }
  }}
>
  <img src={image} alt={title} class="w-full h-auto block" />
  {#if hovered}
    <div class="absolute inset-0 bg-[rgba(20,10,10,0.95)] text-white flex flex-col justify-center p-4 gap-2">
      <div class="content">
        <h3 class="text-lg font-bold">{title}</h3>
        {#if description}
          <p class="text-sm">{description}</p>
        {/if}
        <div class="flex gap-2 flex-wrap">
          {#each tech as tag}
            <span class="bg-[#333] px-2.5 py-1.5 rounded text-xs">{tag}</span>
          {/each}
        </div>
        {#if url}
          <a class="mt-2 inline-block bg-[#ff0077] px-4 py-2 rounded-md text-white no-underline text-sm" href={url}>Learn more →</a>
        {/if}
      </div>
    </div>
  {/if}
</div>