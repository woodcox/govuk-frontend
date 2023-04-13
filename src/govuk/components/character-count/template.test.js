const cheerio = require('cheerio')

const { getExamples } = require('../../../../lib/file-helper')
const { axe, htmlWithClassName } = require('../../../../lib/jest-helpers')
const { render } = require('../../../../lib/nunjucks-helpers')

const WORD_BOUNDARY = '\\b'

describe('Character count', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with id', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $component = $('.govuk-js-character-count')
      expect($component.attr('id')).toEqual('more-detail')
    })

    it('renders with name', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $component = $('.govuk-js-character-count')
      expect($component.attr('name')).toEqual('more-detail')
    })

    it('renders with default number of rows', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $component = $('.govuk-js-character-count')
      expect($component.attr('rows')).toEqual('5')
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = cheerio.load(render('character-count', examples.classes))

      const $component = $('.govuk-js-character-count')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })

    it('renders with rows', () => {
      const $ = cheerio.load(render('character-count', examples['with custom rows']))

      const $component = $('.govuk-js-character-count')
      expect($component.attr('rows')).toEqual('8')
    })

    it('renders with value', () => {
      const $ = cheerio.load(render('character-count', examples['with default value']))

      const $component = $('.govuk-js-character-count')
      expect($component.text()).toEqual('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      const $ = cheerio.load(render('character-count', examples.attributes))

      const $component = $('.govuk-js-character-count')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with formGroup', () => {
      const $ = cheerio.load(render('character-count', examples['formGroup with classes']))

      const $component = $('.govuk-form-group')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })
  })

  describe('count message', () => {
    it('renders with the amount of characters expected', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $countMessage = $('.govuk-character-count__message')
      expect($countMessage.text()).toContain('You can enter up to 10 characters')
    })

    it('renders with the amount of words expected', () => {
      const $ = cheerio.load(render('character-count', examples['with word count']))

      const $countMessage = $('.govuk-character-count__message')
      expect($countMessage.text()).toContain('You can enter up to 10 words')
    })

    it('is associated with the textarea', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $textarea = $('.govuk-js-character-count')
      const $countMessage = $('.govuk-character-count__message')

      const hintId = new RegExp(
        WORD_BOUNDARY + $countMessage.attr('id') + WORD_BOUNDARY
      )

      expect($textarea.attr('aria-describedby'))
        .toMatch(hintId)
    })

    it('renders with custom classes', () => {
      const $ = cheerio.load(render('character-count', examples['custom classes on countMessage']))

      const $countMessage = $('.govuk-character-count__message')
      expect($countMessage.hasClass('app-custom-count-message')).toBeTruthy()
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders the textarea with spellcheck attribute set to true', () => {
      const $ = cheerio.load(render('character-count', examples['spellcheck enabled']))

      const $component = $('.govuk-character-count .govuk-textarea')
      expect($component.attr('spellcheck')).toEqual('true')
    })

    it('renders the textarea with spellcheck attribute set to false', () => {
      const $ = cheerio.load(render('character-count', examples['spellcheck disabled']))

      const $component = $('.govuk-character-count .govuk-textarea')
      expect($component.attr('spellcheck')).toEqual('false')
    })

    it('renders the textarea without spellcheck attribute by default', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $component = $('.govuk-character-count .govuk-textarea')
      expect($component.attr('spellcheck')).toBeUndefined()
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      const $ = cheerio.load(render('character-count', examples['with hint']))

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the character count as "described by" the hint', () => {
      const $ = cheerio.load(render('character-count', examples['with hint']))

      const $textarea = $('.govuk-js-character-count')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($textarea.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = cheerio.load(render('character-count', examples['with default value exceeding limit']))

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the character-count as "described by" the error message', () => {
      const $ = cheerio.load(render('character-count', examples['with default value exceeding limit']))

      const $component = $('.govuk-js-character-count')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('adds the error class to the character-count', () => {
      const $ = cheerio.load(render('character-count', examples['with default value exceeding limit']))

      const $component = $('.govuk-js-character-count')
      expect($component.hasClass('govuk-textarea--error')).toBeTruthy()
    })

    it('renders with classes', () => {
      const $ = cheerio.load(render('character-count', examples['custom classes with error message']))

      const $component = $('.govuk-js-character-count')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = cheerio.load(render('character-count', examples['with default value exceeding limit']))

      const $component = $('.govuk-form-group > .govuk-js-character-count')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the character count "id"', () => {
      const $ = cheerio.load(render('character-count', examples.default))

      const $label = $('.govuk-label')
      expect($label.attr('for')).toEqual('more-detail')
    })
  })

  describe('with threshold', () => {
    it('hides the count to start with', () => {
      const $ = cheerio.load(render('character-count', examples['with threshold']))

      const $component = $('.govuk-character-count')
      expect($component.attr('data-threshold')).toEqual('75')
    })
  })

  describe('with custom textarea description', () => {
    it('allows customisation of the textarea description', () => {
      const $ = cheerio.load(render('character-count', examples['with custom textarea description']))

      const message = $('.govuk-character-count__message').text().trim()
      expect(message).toEqual('Gallwch ddefnyddio hyd at 10 nod')
    })
  })

  describe('translations', () => {
    it('renders with translation data attributes', () => {
      const $ = cheerio.load(render('character-count', examples['with translations']))

      const $component = $('[data-module]')

      Object.entries({
        'data-i18n.characters-under-limit.one': 'One character to go',
        'data-i18n.characters-under-limit.other': '%{count} characters to go',
        'data-i18n.characters-at-limit': 'Zero characters left',
        'data-i18n.characters-over-limit.one': 'One character too many',
        'data-i18n.characters-over-limit.other': '%{count} characters too many',
        'data-i18n.words-under-limit.one': 'One word to go',
        'data-i18n.words-under-limit.other': '%{count} words to go',
        'data-i18n.words-at-limit': 'Zero words left',
        'data-i18n.words-over-limit.one': 'One word too many',
        'data-i18n.words-over-limit.other': '%{count} words too many'
      }).forEach(([attributeName, expectedValue]) => {
        expect($component.attr(attributeName)).toEqual(expectedValue)
      })
    })
  })

  describe('when neither maxlength nor maxwords are set', () => {
    describe('with textarea description set', () => {
      // If the template has no maxwords or maxlength to go for
      // it needs to pass down any textarea description to the JavaScript
      // so it can inject the limit it may have received at instantiation
      it('renders the textarea description as a data attribute', () => {
        const $ = cheerio.load(render('character-count', examples['when neither maxlength nor maxwords are set']))

        // Fallback hint is passed as data attribute
        const $component = $('[data-module]')
        expect($component.attr('data-i18n.textarea-description.other')).toEqual('No more than %{count} characters')

        // No content is set as the accessible description cannot be interpolated on the backend
        // It'll be up to the JavaScript to fill it in
        const $countMessage = $('.govuk-character-count__message')
        expect($countMessage.html()).toMatch(/^\s*$/) // The macro outputs linebreaks around the hint itself
      })
    })

    describe('without textarea description', () => {
      it('does not render a textarea description data attribute', () => {
        const $ = cheerio.load(render(
          'character-count',
          examples['when neither maxlength/maxwords nor textarea description are set']
        ))

        const $component = $('[data-module]')
        expect($component.attr('data-i18n.textarea-description.other')).toBeFalsy()
      })
    })
  })
})
