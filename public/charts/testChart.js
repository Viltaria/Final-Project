const c3 = require('c3');
const d3 = require('d3');

const data = d3.json('../animalData.json', (dat) => {
  let north = 0;
  let south = 0;

  dat.forEach((element) => {
    const parsed = parseFloat(element.latitude);
    if (parsed > 0) return north++;
    return south++;
  });

  const chart = c3.generate({
    bindto: '#left-additional-info',
    data: {
      columns: [
        ['Northern Hemisphere', north],
        ['Southern Hemisphere', south],
      ],
      type: 'pie',
      colors: {
        'Northern Hemisphere': '#C3FF68',
        'Southern Hemisphere': '#4F2958',
      },
    },
  });
});

