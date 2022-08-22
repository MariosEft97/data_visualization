<script>
  import City from "./_design_1_city.svelte";
  import {build_width, build_height, yScale_perline, yScale_perlines, radioValue2} from "./_design_1_store.js"

  import { scaleLinear } from "d3-scale";
  import { extent } from "d3-array";

  import Radio from "./_design_1_radio.svelte";
  import Radio2 from "./_design_1_radio2.svelte";


  let datapoints = []
  fetch("./data/hourly_heating_december.json")
    .then(res=>res.json())
    .then(data=>datapoints=data)

  // $: console.log(datapoints)

  // data structure
  // [0: {city: "Baltimore", buildingtype: "house", day: 1, hour:0, total_heating_energy: 500}
  //  1: {city: "Baltimore", buildingtype: "house", day: 1, hour:0, total_heating_energy: 500}]

  let transformed_data = {}
  $:{
    datapoints.forEach((d) =>{
      if (!(d.city in transformed_data)){
        transformed_data[d.city] = {}
      }
      if (!(d.buildingtype in transformed_data[d.city])){
        transformed_data[d.city][d.buildingtype] = {"values":[], "name":d.buildingtype}
      }

      transformed_data[d.city][d.buildingtype]["values"].push(d.total_heating_energy)
    })
  }

  //  $: console.log(transformed_data)
    
  $: $yScale_perline = scaleLinear().domain(extent(datapoints.map((d)=>d.total_heating_energy))).range([build_height, 0])
  $: $yScale_perlines = scaleLinear().domain(extent(datapoints.map((d)=>d.total_heating_energy))).range([build_height/2, 0])
  // $: xScale = scaleLinear().domain([1,744]).range([0, build_width])
  // $: console.log(extent(datapoints.map((d)=>d.total_heating_energy)))
  
  // Size and margins
  const width = 600;
  const height = 250;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  let radioValue;

	const options = [{
		value: 'Baltimore',
		label: 'Baltimore',
	}, {
		value: 'Chicago',
		label: 'Chicago',
	}, {
		value: 'Los Angeles',
		label: 'Los Angeles',
	}]

  const options2 = [{
		value: 'line',
		label: 'Per line',
	}, {
		value: 'lines',
		label: 'Across all lines',
	}]

</script>


<div>
  <h5>Design 1: Energy use over multiple days.</h5>
  <Radio {options} fontSize={16} legend='Select location:' bind:userSelected={radioValue}/>
  <Radio2 {options2} fontSize={16} legend='Select scaling:' bind:userSelected2={$radioValue2}/>
  <svg width={build_width+150} height={build_height*20}>
    <g transform="translate({margin.left}, {margin.top})">
      {#each Object.keys(transformed_data) as city}
        {#if city==radioValue}
            <City data={transformed_data[city]}/>
        {/if}
      {/each}
    </g>
  </svg>
</div>


<!-- <style>
  svg {
    border: 1px solid black;
    border-radius: 5px;
    background-color: whitesmoke;
  }
  .selected {
    display: inline-flexbox;
		background-color: lightblue;
		color: black;
	}
</style> -->
