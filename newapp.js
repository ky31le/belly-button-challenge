async function getdata() {
    const response = await fetch("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json");
    const data = await response.json();
    console.log(data);
  }

  getdata()

 