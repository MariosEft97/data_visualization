<script>
    import Building from "./_design_1_bulding.svelte"
    import {build_width, build_height, yScale_perline, yScale_perlines, radioValue2} from "./_design_1_store.js"

    export let data = {}
</script>

{#each Object.keys(data) as building, bt_idx}
    <g transform="translate(0, {bt_idx*build_height+(10*bt_idx)})">
        <Building data={data[building]}/>
    </g>
{/each}

