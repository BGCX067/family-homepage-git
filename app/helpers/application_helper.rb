module ApplicationHelper
  
  # http://stackoverflow.com/questions/3705898/best-way-to-add-current-class-to-nav-in-rails-3
  def nav_tabs(tabs=[])
    html = []
    tabs.each do |tab|
      html << (content_tag :li, :class => ("active" if request.fullpath.split(/[\??]/)[0] == tab[:path]) do
        link_to tab[:path] do
          content_tag(:i, '', :class => tab[:icon]) +
          tag(:br) +
          "#{tab[:name]}"
        end
      end)
    end

    html.join.html_safe
  end

end
