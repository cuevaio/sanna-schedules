checkSchedules = async () => {
  const baseUrl = 'https://agendamiento.sanna.pe/api/medic/medicSchedule';
  const headers = { 'content-type': 'application/json' };

  const clinics = {
    5: 'Golf',
    30: 'Los Olivos',
    33: 'PRO',
    34: 'San Miguel',
  };
  const days = [
    '29/9/2024',
    '30/9/2024',
    '1/10/2024',
    '2/10/2024',
    '3/10/2024',
  ];

  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
  for (let d = 0; d < days.length; d++) {
    const day = days[d];

    for (let c = 0; c < Object.keys(clinics).length; c++) {
      const clinicKey = Object.keys(clinics)[c];
      const clinic = clinics[clinicKey];

      const body = JSON.stringify({
        idClinica: clinicKey,
        idEspecialidad: '5', // dermatología
        dia: day,
      });

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers,
          body,
        });
        const html = await response.text();

        const schedules = new Map();
        const lines = html.split('\n').map((line) => line.trim());

        for (let j = 0; j < lines.length - 1; j++) {
          if (lines[j].startsWith('<input type="hidden" name="hora"')) {
            const hour = lines[j].split('value="')[1].slice(0, -2);
            const doctor = lines[j + 5].split('value="')[1].slice(0, -2);
            schedules.set(doctor, [...(schedules.get(doctor) || []), hour]);
          }
        }

        if (schedules.size) {
          console.log(day, clinic);
          schedules.forEach((v, k) => {
            console.log(k);
            console.log(v);
          });
          console.log('\n\n');
        }
      } catch (error) {
        console.error(`Error fetching data for ${day}:`, error);
      }
    }
  }
};

checkSchedules();

setInterval(checkSchedules, 20000);
