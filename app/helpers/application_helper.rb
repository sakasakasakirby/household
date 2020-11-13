module ApplicationHelper
  def page_title
    title = "さかさか計簿"
    title = @page_title + " - " + title if @page_title
    title
  end
end
