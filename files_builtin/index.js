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
    const $spinner = $('#tms-search-spinner');
    const totalCount = $('#tms-items-total').text();

    return {
      beginSearch: function () {
        $spinner.removeClass('d-none');
      },
      endSearch: function () {
        $spinner.addClass('d-none');
      },
      /**
       * @param {number} [value]
       */
      updateItemCount: function (value) {
        const current = (typeof value === 'number') ? value : totalCount;

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

    const word = $(this).find('input[name=word]').val();
    if (word.length === 0) {
      reset();
    } else {
      search(word);
    }
  });

  const $items = $('.tms-item');

  const reset = function () {
    formAction({
      before: function () {
        formControl.lock();
        uiControl.beginSearch();
      },
      main: function (next) {
        itemControl.show();
        next();
      },
      after: function () {
        uiControl.endSearch();
        formControl.unlock();
      },
    });
  };

  /**
   * @param {string} word
   */
  const search = function (word) {
    formAction({
      before: function () {
        formControl.lock();
        uiControl.beginSearch();
      },
      main: function (next) {
        $.ajax({
          url: $('meta[name=APP_PATH_SEARCH]').attr('content'),
          data: {
            word: word,
          },
          dataType: 'json',
          success: function (data) {
            itemControl.show(data);
            next();
          }
        });
      },
      after: function () {
        uiControl.endSearch();
        formControl.unlock();
      },
    });
  };

  const itemControl = (function () {
    return {
      /**
       * @param {IndexItem[]} [data]
       */
      show: function (data) {
        if (data) {
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
        } else {
          $items.show();
          uiControl.updateItemCount();
        }
      },
    };
  })();

  /**
   * @param {FormActionStructure} structure
   */
  const formAction = function (structure) {
    structure.before();
    structure.main(function () {
      structure.after();
    });
  }
});

/**
 * @typedef {Object} FormActionStructure
 * @property {function} before
 * @property {FormActionMain} main
 * @property {function} after
 */

/**
 * @callback FormActionMain
 * @param {function} next
 */
