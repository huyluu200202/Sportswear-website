const Handlebars = require('handlebars');

module.exports = {
  sortable: (field, sort) => {
    const sortType = field === sort.column ? sort.type : 'default';

    const icons = {
      // mặc định
      default: 'fa-solid fa-sort',
      // tăng dần
      asc: 'fa-solid fa-arrow-up-wide-short',
      // giảm dần
      desc: 'fa-solid fa-arrow-down-wide-short',
    };

    const types = {
      default: 'desc',
      asc: 'desc',
      desc: 'asc',
    };

    const icon = icons[sortType];
    const type = types[sortType];

    const href = Handlebars.escapeExpression(
      `?_sort&column=${field}&type=${type}`,
    );
    const output = `
            <a href="${href}">
            <i class="${icon}"></i>
            </a>
            `;
    return new Handlebars.SafeString(output);
  },

  formatCurrency: (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return 'Lỗi định dạng';
    }
    return (
      number.toLocaleString('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) +
      '.000' +
      ' VNĐ'
    );
  },

  multiply: (a, b) => {
    const number1 = parseFloat(a);
    const number2 = parseFloat(b);
    if (isNaN(number1) || isNaN(number2)) {
      return 'Lỗi định dạng';
    }
    return number1 * number2;
  },
};
