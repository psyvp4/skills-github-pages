import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://scrosylrcdscvpjrdqdj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcm9zeWxyY2RzY3ZwanJkcWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTMwNTksImV4cCI6MjA2MjkyOTA1OX0.AMuAzglBPP2UfccB_rB9pzVCpdE_o4zJYChr5BdpQRE';
const supabase = createClient(supabaseUrl, supabaseKey);

let selectedOwnerId = null;
const ownerInput = document.getElementById('owner');
const checkOwnerBtn = document.getElementById('check-owner');
const resultsDiv = document.getElementById('owner-results');
const newOwnerBtn = document.getElementById('new-owner-btn');
const newOwnerForm = document.getElementById('new-owner-form');

ownerInput.addEventListener('input', () => {
  checkOwnerBtn.disabled = ownerInput.value.trim() === '';
});

checkOwnerBtn.addEventListener('click', async () => {
  const name = ownerInput.value.trim();
  resultsDiv.innerHTML = '';
  newOwnerForm.style.display = 'none';
  newOwnerBtn.style.display = 'none';
  selectedOwnerId = null;

  const { data, error } = await supabase
    .from('People')
    .select('*')
    .ilike('Name', `%${name}%`);

  if (error) {
    resultsDiv.textContent = 'Error searching for owner.';
    return;
  }

  if (data.length) {
    data.forEach(person => {
      const div = document.createElement('div');
      div.textContent = `Name: ${person.Name}, Address: ${person.Address}, DOB: ${person.DOB}, License: ${person.LicenseNumber}, Expiry: ${person.ExpiryDate}`;
      const btn = document.createElement('button');
      btn.textContent = 'Select owner';
      btn.addEventListener('click', () => {
        selectedOwnerId = person.PersonID;
        document.getElementById('owner').value = person.Name;
        resultsDiv.innerHTML = `<p>Selected: ${person.Name}</p>`;
        newOwnerBtn.style.display = 'none';
      });
      div.appendChild(btn);
      resultsDiv.appendChild(div);
    });
    newOwnerBtn.style.display = 'block';
  } else {
    resultsDiv.textContent = 'No matches.';
    newOwnerBtn.style.display = 'block';
  }
});

newOwnerBtn.addEventListener('click', () => {
  newOwnerForm.style.display = 'block';
});

document.getElementById('add-owner').addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();
  const dob = document.getElementById('dob').value;
  const license = document.getElementById('license').value.trim();
  const expire = document.getElementById('expire').value;
  const msg = document.getElementById('message-owner');
  msg.textContent = '';

  if (!name || !address || !dob || !license || !expire) {
    msg.textContent = 'Error: All fields are required.';
    return;
  }

  const { data: exists, error: chkErr } = await supabase
    .from('People')
    .select('*')
    .eq('Name', name)
    .eq('Address', address)
    .eq('DOB', dob)
    .eq('LicenseNumber', license)
    .eq('ExpiryDate', expire);
  if (chkErr) { msg.textContent = 'Error'; return; }
  if (exists.length) { msg.textContent = 'Error: Owner already exists.'; return; }

  const { data: newOwner, error: insErr } = await supabase
    .from('People')
    .insert({
      Name: name,
      Address: address,
      DOB: dob,
      LicenseNumber: license,
      ExpiryDate: expire
    })
    .select()
    .single();

  if (insErr || !newOwner) {
    msg.textContent = 'Error';
    return;
  }
  selectedOwnerId = newOwner.PersonID;

  msg.textContent = 'Owner added successfully';
  newOwnerForm.style.display = 'none';
  document.getElementById('owner').value = newOwner.Name;
  resultsDiv.innerHTML = `<p>Selected: ${newOwner.Name}</p>`;

  selectedOwnerId = newOwner.id;
  msg.textContent = 'Owner added successfully';
  newOwnerForm.style.display = 'none';
  document.getElementById('owner').value = newOwner.Name;
  resultsDiv.innerHTML = `<p>Selected: ${newOwner.Name}</p>`;
});

document.getElementById('add-vehicle').addEventListener('click', async () => {
  const rego = document.getElementById('rego').value.trim();
  const make = document.getElementById('make').value.trim();
  const model = document.getElementById('model').value.trim();
  const colour = document.getElementById('colour').value.trim();
  const msgV = document.getElementById('message-vehicle');
  msgV.textContent = '';

  if (!rego || !make || !model || !colour || !selectedOwnerId) {
    msgV.textContent = 'Error: All fields are required and owner must be selected.';
    return;
  }

  const { error: vehErr } = await supabase
    .from('Vehicles')
    .insert({ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: selectedOwnerId });
  if (vehErr) { msgV.textContent = 'Error'; return; }

  msgV.textContent = 'Vehicle added successfully';
  document.getElementById('addvehicleform').reset();
  selectedOwnerId = null;
  checkOwnerBtn.disabled = true;
  resultsDiv.innerHTML = '';
  newOwnerForm.style.display = 'none';
  newOwnerBtn.style.display = 'none';
});