$(function () {
  const formControl = (function () {
    let locked = false;

    return {
      lock: function () {
        locked = true;
      },
      locking: function () {
        return locked === true;
      },
      unlock: function () {
        locked = false;
      },
    };
  })();

  const uiControl = (function () {
    return {
      beginSearch: function () {
        $('#tms-search-spinner').removeClass('d-none');
      },
      endSearch: function () {
        $('#tms-search-spinner').addClass('d-none');
      },
      /**
       * @param {number} [value]
       */
      updateItemCount: function (value) {
        const current = (typeof value === 'number') ? value : $('#tms-items-total').text();

        $('#tms-items-current').text(current);
      },
    };
  })();

  const $form = $('#tms-search');

  $form.on('submit', function (e) {
    e.preventDefault();

    if (formControl.locking()) {
      return;
    }

    formControl.lock();

    const word = $(this).find('input[name=word]').val();
    if (word.length === 0) {
      reset();
    } else {
      search(word);
    }
  });

  const $items = $('.tms-item');

  const reset = function () {
    $items.show();
    uiControl.updateItemCount();
    formControl.unlock();
  };

  /**
   * @param {string} word
   */
  const search = function (word) {
    uiControl.beginSearch();

    $.ajax({
      url: $('meta[name=APP_PATH_SEARCH]').attr('content'),
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
    const targets = data.map(function (item) {
      return item.notation_md5;
    });

    $items.each(function (idx, item) {
      const md5 = $(item).data('tms-item-md5');
      if (targets.indexOf(md5) >= 0) {
        $(item).show();
      } else {
        $(item).hide();
      }
    });

    uiControl.updateItemCount(data.length);
    uiControl.endSearch();
    formControl.unlock();
  };
});
