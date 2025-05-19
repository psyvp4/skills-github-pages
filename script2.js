import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://scrosylrcdscvpjrdqdj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcm9zeWxyY2RzY3ZwanJkcWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTMwNTksImV4cCI6MjA2MjkyOTA1OX0.AMuAzglBPP2UfccB_rB9pzVCpdE_o4zJYChr5BdpQRE';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form2 = document.querySelector('#vehiclesearchform');
  if (!form2) {
    console.error('vehiclesearchform not found!');
    return;
  }

  form2.addEventListener('submit', async (event) => {
    event.preventDefault();

    const rego = document.getElementById('rego').value.trim();
    const resultsDiv = document.getElementById('results');
    const messageDiv = document.getElementById('message');
    resultsDiv.innerHTML = '';
    messageDiv.textContent = '';

    if (!rego) {
      messageDiv.textContent = 'Error: Please enter a registration number.';
      return;
    }

    let { data, error } = await supabase
      .from('Vehicles')
      .select(`
        *,
        People (
          Name,
          LicenseNumber
        )
      `)
      .ilike('VehicleID', `${rego}`);

    if (error) {
      console.error(error);
      messageDiv.textContent = 'Error fetching vehicle data.';
      return;
    }

    if (data.length === 0) {
      messageDiv.textContent = 'Vehicle not found.';
      return;
    }

    messageDiv.textContent = 'Vehicle(s) found:';

    data.forEach(vehicle => {
      const div = document.createElement('div');
      div.className = 'result-box';

      const owner = vehicle.People;
      const ownerName = owner?.Name || 'Unknown';
      const ownerLicense = owner?.LicenseNumber || 'Unknown';

      div.innerHTML = `
        <strong>Registration:</strong> ${vehicle.VehicleID}<br>
        <strong>Make:</strong> ${vehicle.Make || 'N/A'}<br>
        <strong>Colour:</strong> ${vehicle.Colour || 'N/A'}<br>
        <strong>Owner Name:</strong> ${ownerName}<br>
        <strong>Owner License:</strong> ${ownerLicense}
      `;

      resultsDiv.appendChild(div);
    });
  });
});
