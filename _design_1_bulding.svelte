<script>
    import {build_width, build_height, xScale, yScale_perline, yScale_perlines, radioValue2} from "./_design_1_store.js"
    export let data = [];
        
    let pathGenerator1 = (d) => {
        // console.log(d)
        let path = "M 0," + $yScale_perline(0);
        d.forEach((value, idx)=>{path += " " + xScale(idx) + "," + $yScale_perline(value)})
    
        // console.log(path)
        return path;
    }

    let pathGenerator2 = (d) => {
        // console.log(d)
        let path = "M 0," + $yScale_perlines(0);
        d.forEach((value, idx)=>{path += " " + xScale(idx) + "," + $yScale_perlines(value)})
    
        // console.log(path)
        return path;
    }
    
</script>

<style>
    /* circle{
      fill: black;
      fill-opacity: 0.5;
    } */
    rect{
        fill:none;
        stroke:none;
        stroke-opacity: 0.5;
    }
    path{
        stroke: none;
        fill: black;
        fill-opacity: 1;
    }
    /* line{
        stroke: black;
        stroke-width: 0.5;
    } */
    text{
        font-size: 14px;
        /* dominant-baseline: middle; */
    }
</style>

<rect x=0 y=0 width={build_width} height={build_height}/>
{#if $radioValue2=="line"}
    <path d={pathGenerator1(data["values"])}/>
    <text x={build_width+10} y={build_height}>{data["name"]}</text>
{/if}
{#if $radioValue2=="lines"}
    <path d={pathGenerator2(data["values"])}/>
    <text x={build_width+10} y={build_height/2}>{data["name"]}</text>
{/if}
<!-- <path d={pathGenerator1(data["values"])}/> -->
