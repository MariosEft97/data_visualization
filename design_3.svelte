<script>
  import {scaleLinear} from 'd3-scale';
  import { extent } from "d3-array";

  // Size and margins
  const width = 550;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
    
  let datapoints = []
    fetch("./data/hourly_electricity_vs_gas_december.json")
      .then(res=>res.json())
      .then(data=>datapoints=data)

  // $: console.log(datapoints)

  let transformed_data = {}
  $:{
    datapoints.forEach((d) =>{
      if (!(d.week in transformed_data)){
        transformed_data[d.week] = {"electricity":[], "gas":[]}
      }
      transformed_data[d.week]["electricity"].push(d.total_electrity)
      transformed_data[d.week]["gas"].push(d.total_gas)
    })
  }
  $:console.log(transformed_data)

  // $:console.log(extent(datapoints.map((d)=>d.total_gas))[1])
  // $:console.log(extent(datapoints.map((d)=>d.total_electrity))[1])

  $:leafScale=scaleLinear().domain(extent(datapoints.map((d)=>d.total_gas))).range([0,100])

  let leaf_height = 120;

  let odd_direction = -1;
  let even_direction = 1;

  let electricity_path_odd=(d) => {
    let path="M 0," + leafScale(0);
    d.forEach((value, idx)=>{path += " " + (odd_direction*idx) + ',' + (leafScale(value))})
    return path;
  }
        
  let gas_path_odd=(d) => {
    let path="M 0," + leafScale(0);
    d.forEach((value, idx)=>{path += " " + (odd_direction*idx) + ',' + (-leafScale(value))})
    return path;    
  }

  let electricity_path_even=(d) => {
    let path="M 0," + leafScale(0);
    d.forEach((value, idx)=>{path += " " + (even_direction*idx) + ',' + (leafScale(value))})
    return path;
  }
        
  let gas_path_even=(d) => {
    let path="M 0," + leafScale(0);
    d.forEach((value, idx)=>{path += " " + (even_direction*idx) + ',' + (-leafScale(value))})
    return path;    
  }

</script>


<svg {width} {height}>
  <g transform="translate({margin.left}, {margin.top})">
    
    <line x1={innerWidth/2} y1={margin.bottom+10} x2={innerWidth/2} y2={innerHeight-100}/>
    
    {#each Object.keys(transformed_data) as week, w_idx}
      <g transform="translate({innerWidth/2},{(innerHeight-leaf_height*(w_idx))-leaf_height})">
        {#if week != 52}
          {#each Object.keys(transformed_data[week]) as energy, e_idx}
            {#if week%2 == 0}
            <text class="week" x={innerWidth/2-60} y=-20>Week {week}</text>
              <g transform="rotate({odd_direction*15})">
                {#if energy == "electricity"}
                  <path class="electricity" d={electricity_path_even(transformed_data[week][energy])}/>
                {:else if energy == "gas"}
                  <path class="gas" d={gas_path_even(transformed_data[week][energy])}/>
                {/if}
              </g>
            {:else if week%2 != 0 }
              <text class="week" x={-innerWidth/2} y=-20>Week {week}</text>
              <g transform="rotate({even_direction*15})">
                {#if energy == "electricity"}
                  <path class="electricity" d={electricity_path_odd(transformed_data[week][energy])}/>
                {:else if energy == "gas"}
                  <path class="gas" d={gas_path_odd(transformed_data[week][energy])}/>
                {/if}
              </g>
            {/if}
          {/each}
        {/if}
      </g>
    {/each}
  </g>

  <text class="city" x={innerWidth/2-40} y={innerHeight-40}>Chicago</text>
  <text class="date" x={innerWidth/2-50} y={innerHeight-10}>(December 2014)</text>
  <text class="electricity" x={innerWidth-55} y={innerHeight-30}>Electricity</text>
  <text class="gas" x={innerWidth-10} y={innerHeight-10}>Gas</text>
</svg>


<style>
  
  path.electricity{
    fill: lightsalmon;
    fill-opacity: 0.5;
    stroke: orange;
    stroke-width: 1.5px;
  }
  
    path.gas{
    fill: lightblue;
    fill-opacity: 0.5;
    stroke: lightskyblue;
    stroke-width: 1.5px;
  }
  
  line {
  stroke:black;
  }
  
  text.city{
    font-size:28px;
  }
  
  text.date{
    font-size: 18px;
  }

  text.week{
    font-size: 18px;
  }

  text.electricity{
    font-size: 18px;
    fill: lightsalmon;
    /* stroke: orange;
    stroke-width: 0.5px; */
  }
  text.gas{
    font-size: 18px;
    fill: lightblue;
    /* stroke: lightskyblue;
    stroke-width: 0.5px; */
  }
</style>
