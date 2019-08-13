const theme = document.createElement('dom-module');
theme.id = 'vcf-progress-spinner-lumo';
theme.setAttribute('theme-for', 'vcf-progress-spinner');
theme.innerHTML = `
    <template>
      <style>
        :host {}
      </style>
    </template>
  `;
theme.register(theme.id);
