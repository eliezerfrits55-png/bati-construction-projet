/**
 * Validateurs réutilisables pour les formulaires
 */

export const isRequired = (value, fieldName = 'Ce champ') => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${fieldName} est requis`;
  }
  return null;
};

export const isEmail = (value) => {
  if (!value) return null;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return 'Email invalide';
  }
  return null;
};

export const isPhoneCM = (value) => {
  if (!value) return null;
  // Numéros camerounais : 6XXXXXXXX ou 2XXXXXXXX (9 chiffres après le préfixe)
  const cleaned = String(value).replace(/\s+/g, '');
  const regex = /^(6|2)[0-9]{8}$/;
  if (!regex.test(cleaned)) {
    return 'Numéro camerounais invalide (ex: 6XXXXXXXX)';
  }
  return null;
};

export const minLength = (value, min = 8, fieldName = 'Ce champ') => {
  if (!value) return null;
  if (String(value).length < min) {
    return `${fieldName} doit contenir au moins ${min} caractères`;
  }
  return null;
};

export const maxLength = (value, max = 255, fieldName = 'Ce champ') => {
  if (!value) return null;
  if (String(value).length > max) {
    return `${fieldName} ne doit pas dépasser ${max} caractères`;
  }
  return null;
};

export const isPasswordMatch = (password, confirmation) => {
  if (password !== confirmation) {
    return 'Les mots de passe ne correspondent pas';
  }
  return null;
};

export const isNumber = (value, fieldName = 'Ce champ') => {
  if (value === null || value === undefined || value === '') return null;
  if (isNaN(Number(value))) {
    return `${fieldName} doit être un nombre`;
  }
  return null;
};

export const minValue = (value, min = 0, fieldName = 'Ce champ') => {
  if (value === null || value === undefined || value === '') return null;
  if (Number(value) < min) {
    return `${fieldName} doit être supérieur ou égal à ${min}`;
  }
  return null;
};

export const isChecked = (value, message = 'Vous devez accepter les conditions') => {
  if (!value) return message;
  return null;
};

/**
 * Valide un objet de données avec un schéma de règles
 * @param {Object} data - Les données du formulaire
 * @param {Object} schema - { field: [(value) => errorMessage | null] }
 * @returns {Object} - { field: errorMessage }
 */
export const validateForm = (data, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const rules = schema[field];
    for (const rule of rules) {
      const error = rule(data[field], data);
      if (error) {
        errors[field] = error;
        break; // On s'arrête à la première erreur du champ
      }
    }
  });

  return errors;
};

/**
 * Exemple d'utilisation :
 *
 * const schema = {
 *   email: [(v) => isRequired(v, 'Email'), isEmail],
 *   password: [(v) => isRequired(v, 'Mot de passe'), (v) => minLength(v, 8, 'Mot de passe')],
 *   password_confirmation: [
 *     (v) => isRequired(v, 'Confirmation'),
 *     (v, data) => isPasswordMatch(data.password, v),
 *   ],
 * };
 *
 * const errors = validateForm(formData, schema);
 * if (Object.keys(errors).length === 0) { // OK }
 */