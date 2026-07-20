-- remove-stray-divfence.lua
-- Removes stray ":::" strings that leak into the HTML output when Quarto's
-- listing wrapper fenced divs are interrupted by raw HTML blocks from the
-- EJS template.

function Para(el)
  if #el.content == 1
     and el.content[1].t == "Str"
     and el.content[1].text == ":::" then
    return {}  -- delete the node
  end
end

function Plain(el)
  if #el.content == 1
     and el.content[1].t == "Str"
     and el.content[1].text == ":::" then
    return {}  -- delete the node
  end
end
