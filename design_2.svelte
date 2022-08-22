<script>
  import { scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { lineRadial } from "d3-shape";

  let datapoints = []
    fetch("./data/daily_heating_cooling.json")
      .then(res=>res.json())
      .then(data=>datapoints=data)

  // $: console.log(datapoints)

  let transformed_data = {}
  $:{
    datapoints.forEach((d) =>{
      if (!(d.city in transformed_data)){
        transformed_data[d.city] = {"heating":[], "cooling":[]}
      }
      
      transformed_data[d.city]["heating"].push(d.heating)
      transformed_data[d.city]["cooling"].push(d.cooling)
    })
  }


  // $: console.log(transformed_data)
  
  let city_width = 300;
  let city_height = 150;
  let radius = 110;

  $:yearly = scaleLinear().domain([0, 365]).range([0, 2*Math.PI]);
  $:scaleRadiusHeating = scaleLinear().domain(extent(datapoints.map((d)=>d.heating))).range([0, 100]);
  $:scaleRadiusCooling = scaleLinear().domain(extent(datapoints.map((d)=>d.cooling))).range([0, 100]);
  
  let radial = lineRadial()
    
  // .angle((d)=>yearly(d.month))
  // .radius((d)=>scaleRadiusHeating(d.heating))
  // .curve(curveCatmullRomOpen)
    
  // .angle((d)=>yearly(d.month))
  // .radius((d)=>scaleRadiusCooling(d.cooling))
  // .curve(curveCatmullRomOpen)
  
  let heating_path=(d) => {
    // console.log(d)
    let heat_data = [];
    d.forEach((value, idx)=>{heat_data.push([yearly(idx), scaleRadiusHeating(value)])})
    // console.log(heat_data)
    let path = radial(heat_data)
    // console.log(path)
    return path;
  }

  let cooling_path = (d) => {
    // console.log(d)
    let cool_data = [];
    d.forEach((value, idx)=>{cool_data.push([yearly(idx), scaleRadiusCooling(value)])})
    // console.log(cool_data)
    let path = radial(cool_data)
    // console.log(path)
    return path;
  }
  
  // console.log(cooling_path(transformed_data.city.cooling))
  // console.log(heating_path(transformed_data.city.heating))

  // Size and margins
  const width = 1000;
  const height = 400;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  
</script>

<div>
  <svg width={width} height={height}>
    <g transform="translate({margin.left}, {margin.top+20})">
      {#each Object.keys(transformed_data) as city, c_idx}
        <g transform="translate({c_idx*city_width-175}, {margin.top})">
          <text class="city" x={(city_width)}>{city}</text>
          
          <!-- vertical axis -->
          <line x1={city_width+45} x2={city_width+45} y1={(city_height-radius)} y2={(city_height+radius)}/>
          
          <!-- horizontal axis -->
          <line x1={(city_width+45-radius)} x2={(city_width+45+radius)} y1={city_height} y2={city_height}/>
      
          <circle cx={city_width+45} cy={city_height} r={radius}/>
  
          <text class="num" x={(city_width+45)-5} y={(city_height-radius)-5}>0</text>
          <text class="num" x={(city_width+45)+radius+5} y={(city_height+5)}>3</text>
          <text class="num" x={(city_width+45)-5} y={(city_height+radius)+20}>6</text>
          <text class="num" x={(city_width+45)-radius-15} y={(city_height+5)}>9</text>
          
          {#each Object.keys(transformed_data[city]) as energy, e_idx}
            <g transform="translate({city_width+45}, {city_height})">
              {#if energy=="heating"}
                  <path class="heat" d={heating_path(transformed_data[city][energy])}/>
              {/if}
              {#if energy=="cooling"}
                  <path class="cool" d={cooling_path(transformed_data[city][energy])}/>
              {/if}
           </g> 
          {/each}
        </g>
      {/each}
      
      <text class="heating" x={innerWidth-100} y={innerHeight-40}>Heating</text>
      <text class="cooling" x={innerWidth-100} y={innerHeight-20}>Cooling</text>

    </g>
  </svg>

</div>

<style>
  /* svg {
    border: 1px solid black;
    border-radius: 5px;
  } */
  line{
    stroke: black;
    stroke-width: 1.5;
  }
  circle{
    fill: none;
    stroke: black;
    stroke-width: 1.5;
  }
  text.city{
    font-size: 22px;
    /* dominant-baseline: middle; */
  }
  text.num{
    font-size: 18px;
    /* dominant-baseline: middle; */
  }
  path.heat{
    fill: lightsalmon;
    fill-opacity: 0.5;
    stroke: orange;
    stroke-width: 1.5px;
  }
  path.cool{
    fill: lightblue;
    fill-opacity: 0.5;
    stroke: lightskyblue;
    stroke-width: 1.5px;
  }

  text.heating{
    font-size: 18px;
    fill: lightsalmon;
    /* stroke: orange;
    stroke-width: 0.5px; */
  }
  text.cooling{
    font-size: 18px;
    fill: lightblue;
    /* stroke: lightskyblue;
    stroke-width: 0.5px; */
  }

</style>