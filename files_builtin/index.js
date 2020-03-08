$(function () {
  const reset = function () {
    $('.tms-item').show();
  };

  /**
   * @param {string} word
   */
  const search = function (word) {
    $.ajax({
      url: '/-/search',
      data: {
        word: word,
      },
      dataType: 'json',
      success: render,
    });
  };

  /**
   * @param {IndexItem[]} data
   */
  const render = function (data) {
    const notations = data.map(function (item) {
      return item.notation;
    });

    $('.tms-item').each(function (idx, item) {
      const notation = $(item).find('.tms-notation').text();
      if (notations.indexOf(notation) >= 0) {
        $(item).show();
      } else {
        $(item).hide();
      }
    });
  };

  const $form = $('#tms-search');

  $form.on('submit', function (e) {
    e.preventDefault();

    const word = $(this).find('input[name=word]').val();
    if (word.length === 0) {
      reset();
    } else {
      search(word);
    }
  });
});
