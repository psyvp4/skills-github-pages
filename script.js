import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://scrosylrcdscvpjrdqdj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcm9zeWxyY2RzY3ZwanJkcWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTMwNTksImV4cCI6MjA2MjkyOTA1OX0.AMuAzglBPP2UfccB_rB9pzVCpdE_o4zJYChr5BdpQRE';
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.querySelector('#peoplesearchform');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const license = document.getElementById('license').value.trim();
  const resultsDiv = document.getElementById('results');
  const messageDiv = document.getElementById('message');
  resultsDiv.innerHTML = '';
  messageDiv.textContent = '';

  if ((!name && !license) || (name && license)) {
    messageDiv.textContent = 'Error';
    return;
  }

  let { data, error } = await supabase
    .from('People')
    .select('*')
    .ilike(name ? 'Name' : 'LicenseNumber', name ? `%${name}%` : `%${license}%`);

  if (error) {
    console.error(error); // Add this
    messageDiv.textContent = 'Error';
  }
  else if (data.length === 0) {
    messageDiv.textContent = 'No results found';
  } else {
    messageDiv.textContent = 'Search successful';
    data.forEach(person => {
      const div = document.createElement('div');
      div.classList.add('result-box');
      div.textContent = `PersonId :${person.PersonID},  Name Number: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License Number: ${person.LicenseNumber}, Expiry Date: ${person.ExpiryDate}`;
      resultsDiv.appendChild(div);
    });
  }
});